from pathlib import Path
from PIL import Image

for path in Path("src/assets").rglob("*"):
    if path.suffix.lower() in {".png", ".jpg", ".jpeg"}:
        with Image.open(path) as image:
            image.save(
                path.with_suffix(".webp"),
                "WEBP",
                quality=82,
                method=6,
            )
        print(f"Selesai: {path.name}")