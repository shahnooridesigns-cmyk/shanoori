#!/usr/bin/env bash
# Builds the frame sequence for the home page "How We Work" scroll animation.
#
#   bash scripts/process-frames.sh               # from the 4 images in public/images/process-*.jpg
#   bash scripts/process-frames.sh my-video.mp4  # from a video (any length; sampled to ~120 frames)
#
# Output: public/process-frames/frame-001.webp … frame-NNN.webp
# After changing the frame count, update FRAME_COUNT in src/components/home/ProcessScroll.tsx.
# Requires ffmpeg on PATH (or set FFMPEG=/path/to/ffmpeg).
set -euo pipefail

FFMPEG="${FFMPEG:-ffmpeg}"
OUT="public/process-frames"
SIZE="1280x800"
mkdir -p "$OUT" && rm -f "$OUT"/frame-*.webp

if [ $# -ge 1 ]; then
  # Video: spread ~120 frames evenly across the whole clip, cover-cropped to 16:10
  DURATION=$("${FFPROBE:-ffprobe}" -v error -show_entries format=duration -of csv=p=0 "$1")
  FPS=$(awk "BEGIN { printf \"%.4f\", 120 / $DURATION }")
  "$FFMPEG" -hide_banner -loglevel error -y -i "$1" \
    -vf "fps=$FPS,scale=${SIZE%x*}:${SIZE#*x}:force_original_aspect_ratio=increase,crop=${SIZE%x*}:${SIZE#*x}" \
    -c:v libwebp -quality 62 -compression_level 5 "$OUT/frame-%03d.webp"
else
  # Images: slow push-in on each step with 0.6s dissolves, 2.5s per step, sampled at 15fps
  D=2.5
  KB="scale=2400:1500:force_original_aspect_ratio=increase,crop=2400:1500,zoompan=z='1+0.14*on/75':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=$SIZE:fps=30,setsar=1,trim=duration=$D"
  "$FFMPEG" -hide_banner -loglevel error -y \
    -loop 1 -framerate 30 -t $D -i public/images/process-1.jpg \
    -loop 1 -framerate 30 -t $D -i public/images/process-2.jpg \
    -loop 1 -framerate 30 -t $D -i public/images/process-3.jpg \
    -loop 1 -framerate 30 -t $D -i public/images/process-4.jpg \
    -filter_complex "[0:v]$KB[a];[1:v]$KB[b];[2:v]$KB[c];[3:v]$KB[d];[a][b]xfade=transition=fade:duration=0.6:offset=1.9[ab];[ab][c]xfade=transition=fade:duration=0.6:offset=3.8[abc];[abc][d]xfade=transition=fade:duration=0.6:offset=5.7,fps=15,format=yuv420p[out]" \
    -map "[out]" -c:v libwebp -quality 62 -compression_level 5 "$OUT/frame-%03d.webp"
fi

echo "Frames: $(ls "$OUT" | wc -l) ($(du -sh "$OUT" | cut -f1))"
