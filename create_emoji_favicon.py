from PIL import Image, ImageDraw, ImageFont
import sys

emoji = "😋"
sizes = [
    (16, "favicon-16x16.png"),
    (32, "favicon-32x32.png"),
    (180, "apple-touch-icon.png"),
    (192, "android-chrome-192x192.png"),
    (512, "android-chrome-512x512.png")
]

try:
    # Try to use a system font that supports emoji
    for size, filename in sizes:
        img = Image.new('RGBA', (size, size), (255, 255, 255, 255))
        draw = ImageDraw.Draw(img)
        
        # Try different font sizes to fit the emoji
        font_size = int(size * 0.7)
        try:
            # Try Apple Color Emoji font
            font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", font_size)
        except:
            try:
                # Fallback to another emoji font
                font = ImageFont.truetype("/Library/Fonts/Apple Color Emoji.ttc", font_size)
            except:
                print(f"Warning: Could not load emoji font, using default")
                font = ImageFont.load_default()
        
        # Calculate text position to center it
        bbox = draw.textbbox((0, 0), emoji, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        position = ((size - text_width) // 2 - bbox[0], (size - text_height) // 2 - bbox[1])
        
        draw.text(position, emoji, font=font, embedded_color=True)
        img.save(filename)
        print(f"Created {filename}")

    print("All emoji favicons created successfully!")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

