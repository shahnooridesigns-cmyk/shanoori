#!/usr/bin/env bash
# Builds the frame sequence for the home page "How We Work" scroll animation.
#
#   bash scripts/process-frames.sh               # "line drawing" video from public/images/process-1..4.jpg
#   bash scripts/process-frames.sh my-video.mp4  # from your own video
#
# Image mode renders scripts/output/process-video.mp4: for each step, gold lines draw in from a
# black screen (strongest edges first, fine detail last), then the real photo fades in over them,
# and each step dissolves into the next step's drawing.
#
# Output frames: public/process-frames/frame-001.webp … frame-NNN.webp
# After changing the frame count, update FRAME_COUNT in src/components/home/ProcessScroll.tsx.
# Requires ffmpeg/ffprobe on PATH (or set FFMPEG / FFPROBE).
set -euo pipefail

FFMPEG="${FFMPEG:-ffmpeg}"
FFPROBE="${FFPROBE:-ffprobe}"
OUT="public/process-frames"
W=1152
H=720
TARGET_FRAMES=140

if [ $# -ge 1 ]; then
  VIDEO="$1"
else
  mkdir -p scripts/output
  VIDEO="scripts/output/process-video.mp4"
  D=4       # seconds per step
  DRAW=1.8  # lines drawing in
  FILL=1.6  # photo fading in (starts when drawing ends)
  XF=0.6    # dissolve between steps

  FILTER=""
  for i in 0 1 2 3; do
    FILTER+="[$i:v]scale=2400:1500:force_original_aspect_ratio=increase,crop=2400:1500,"
    FILTER+="zoompan=z='1+0.08*on/($D*30)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=30,"
    FILTER+="trim=duration=$D,setpts=PTS-STARTPTS,setsar=1,split=2[p$i][e$i];"
    # Edge strength → mask whose threshold falls over time, so bold lines appear before fine ones
    FILTER+="[e$i]format=gray,gblur=sigma=1.6,sobel=scale=1.5,geq=lum='clip((p(X,Y)-(255-195*min(T/$DRAW,1)))*5,0,255)'[m$i];"
    FILTER+="color=c=0xE4D4A3:s=${W}x${H}:r=30:d=$D,format=rgba[g$i];[g$i][m$i]alphamerge[l$i];"
    FILTER+="color=c=black:s=${W}x${H}:r=30:d=$D[b$i];[b$i][l$i]overlay[lb$i];"
    FILTER+="[p$i]format=rgba,fade=in:st=$DRAW:d=$FILL:alpha=1[pa$i];"
    FILTER+="[lb$i][pa$i]overlay,format=yuv420p,setsar=1[s$i];"
  done
  O1=$(awk "BEGIN{print $D-$XF}"); O2=$(awk "BEGIN{print 2*($D-$XF)}"); O3=$(awk "BEGIN{print 3*($D-$XF)}")
  FILTER+="[s0][s1]xfade=transition=fade:duration=$XF:offset=$O1[x1];"
  FILTER+="[x1][s2]xfade=transition=fade:duration=$XF:offset=$O2[x2];"
  FILTER+="[x2][s3]xfade=transition=fade:duration=$XF:offset=$O3[out]"

  "$FFMPEG" -hide_banner -loglevel error -y \
    -loop 1 -framerate 30 -t $D -i public/images/process-1.jpg \
    -loop 1 -framerate 30 -t $D -i public/images/process-2.jpg \
    -loop 1 -framerate 30 -t $D -i public/images/process-3.jpg \
    -loop 1 -framerate 30 -t $D -i public/images/process-4.jpg \
    -filter_complex "$FILTER" -map "[out]" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart "$VIDEO"
  echo "Video: $VIDEO"
fi

# Spread TARGET_FRAMES frames evenly across the clip, cover-cropped to ${W}x${H}
DURATION=$("$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
FPS=$(awk "BEGIN { printf \"%.4f\", $TARGET_FRAMES / $DURATION }")
mkdir -p "$OUT" && rm -f "$OUT"/frame-*.webp
"$FFMPEG" -hide_banner -loglevel error -y -i "$VIDEO" \
  -vf "fps=$FPS,scale=$W:$H:force_original_aspect_ratio=increase,crop=$W:$H" \
  -c:v libwebp -quality 50 -compression_level 5 "$OUT/frame-%03d.webp"

echo "Frames: $(ls "$OUT" | wc -l) ($(du -sh "$OUT" | cut -f1))"
