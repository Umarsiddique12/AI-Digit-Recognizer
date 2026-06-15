import io
import numpy as np
from PIL import Image, ImageFilter

def preprocess_image(image_bytes):
    """
    Preprocess the image to match MNIST dataset format exactly.
    MNIST digits are:
      - White strokes on BLACK background
      - Bounding-box cropped
      - Scaled to fit inside 20x20 px with aspect ratio preserved
      - Centered in a 28x28 image using the centre of mass
      - Normalized to [0, 1]
    """
    # 1. Open and flatten onto white canvas → grayscale
    img = Image.open(io.BytesIO(image_bytes)).convert('RGBA')
    bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
    img = Image.alpha_composite(bg, img).convert('L')

    # 2. Invert (canvas: black strokes on white → MNIST: white strokes on black)
    img_arr = np.array(img, dtype=np.uint8)
    img_arr = 255 - img_arr          # now white strokes on black background

    # 3. Threshold to remove noise
    img_arr = (img_arr > 30).astype(np.uint8) * 255

    # 4. Find bounding box of the drawn digit
    rows = np.any(img_arr > 0, axis=1)
    cols = np.any(img_arr > 0, axis=0)

    if not rows.any():
        # Canvas is empty – return blank
        return np.zeros((1, 28, 28, 1), dtype=np.float32)

    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    # Crop to bounding box
    digit = img_arr[rmin:rmax + 1, cmin:cmax + 1]

    # 5. Scale to 20x20 while preserving aspect ratio (MNIST standard)
    h, w = digit.shape
    if h > w:
        new_h = 20
        new_w = max(1, int(w * 20 / h))
    else:
        new_w = 20
        new_h = max(1, int(h * 20 / w))

    digit_img = Image.fromarray(digit)
    digit_img = digit_img.resize((new_w, new_h), Image.LANCZOS)

    # Apply slight gaussian blur to smooth jagged edges (like MNIST)
    digit_img = digit_img.filter(ImageFilter.GaussianBlur(radius=0.5))
    digit_arr = np.array(digit_img, dtype=np.float32)

    # 6. Place on 28x28 black canvas, centered
    canvas = np.zeros((28, 28), dtype=np.float32)
    y_offset = (28 - new_h) // 2
    x_offset = (28 - new_w) // 2
    canvas[y_offset:y_offset + new_h, x_offset:x_offset + new_w] = digit_arr

    # 7. Normalize to [0, 1]
    canvas = canvas / 255.0

    # 8. Reshape to (1, 28, 28, 1) for CNN
    return canvas.reshape(1, 28, 28, 1)
