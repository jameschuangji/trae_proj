document.addEventListener('DOMContentLoaded', () => {
    const imageLoader = document.getElementById('imageLoader');
    const subtitleHeightInput = document.getElementById('subtitleHeight');
    const fontSizeInput = document.getElementById('fontSize');
    const fontColorInput = document.getElementById('fontColor');
    const outlineColorInput = document.getElementById('outlineColor');
    const watermarkTextInput = document.getElementById('watermarkText'); // Added for watermark
    const subtitleTextInput = document.getElementById('subtitleText');
    const generateButton = document.getElementById('generateButton');
    const saveButton = document.getElementById('saveButton');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let originalImage = null;

    imageLoader.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage = new Image();
                originalImage.onload = () => {
                    console.log('图片已加载');
                };
                originalImage.onerror = () => {
                    alert('无法加载图片。请确保文件格式正确。');
                    originalImage = null;
                };
                originalImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    generateButton.addEventListener('click', () => {
        if (!originalImage) {
            alert('请先选择一张图片！');
            return;
        }

        const subtitles = subtitleTextInput.value.split('\n').filter(line => line.trim() !== '');
        if (subtitles.length === 0) {
            alert('请输入字幕文本！');
            return;
        }

        const subtitleHeight = parseInt(subtitleHeightInput.value) || 40;
        const fontSize = parseInt(fontSizeInput.value) || 20;
        const fontColor = fontColorInput.value;
        const outlineColor = outlineColorInput.value;
        const outlineWidth = 2; // Fixed outline width

        const singleLineHeight = subtitleHeight;
        const totalSubtitleBlockHeight = subtitles.length * singleLineHeight;

        // Set canvas dimensions: original image height + total subtitle height
        canvas.width = originalImage.width;
        canvas.height = originalImage.height + totalSubtitleBlockHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw original image at the top
        ctx.drawImage(originalImage, 0, 0);

        // --- Draw Watermark --- Start ---
        const watermarkText = watermarkTextInput.value.trim();
        if (watermarkText !== '') {
            const currentFontSize = parseInt(fontSizeInput.value) || 20;
            const watermarkFontSize = currentFontSize + 2; // Slightly larger
            const currentFontColor = fontColorInput.value;
            const currentOutlineColor = outlineColorInput.value;
            const currentOutlineWidth = 2; // Assuming same outline width as subtitles, or define separately

            // Save current context state for text
            const originalTextAlign = ctx.textAlign;
            const originalTextBaseline = ctx.textBaseline;
            const originalFont = ctx.font;
            const originalStrokeStyle = ctx.strokeStyle;
            const originalFillStyle = ctx.fillStyle;
            const originalLineWidth = ctx.lineWidth;

            ctx.font = `${watermarkFontSize}px sans-serif`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillStyle = currentFontColor;
            ctx.strokeStyle = currentOutlineColor;
            ctx.lineWidth = currentOutlineWidth;

            const watermarkX = canvas.width - 10; // 10px padding from right
            const watermarkY = 10;              // 10px padding from top

            if (currentOutlineWidth > 0) {
                ctx.strokeText(watermarkText, watermarkX, watermarkY);
            }
            ctx.fillText(watermarkText, watermarkX, watermarkY);

            // Restore context state for subsequent drawing (e.g., subtitles)
            ctx.textAlign = originalTextAlign;
            ctx.textBaseline = originalTextBaseline;
            ctx.font = originalFont;
            ctx.strokeStyle = originalStrokeStyle;
            ctx.fillStyle = originalFillStyle;
            ctx.lineWidth = originalLineWidth;
        }
        // --- Draw Watermark --- End ---

        // Prepare subtitle background pattern (one pattern for each line, singleLineHeight tall)
        let bgPatternCanvas = null;
        if (subtitles.length > 0 && singleLineHeight > 0) {
            bgPatternCanvas = document.createElement('canvas');
            bgPatternCanvas.width = originalImage.width;
            bgPatternCanvas.height = singleLineHeight;
            const bgCtx = bgPatternCanvas.getContext('2d');

            // Check if original image is tall enough to provide a full strip of singleLineHeight
            // and has positive width. singleLineHeight is already guaranteed > 0 by the outer 'if' condition.
            if (originalImage.height >= singleLineHeight && originalImage.width > 0) {
                // Yes, take the bottom strip of singleLineHeight from original image and draw it to fill the pattern canvas.
                bgCtx.drawImage(originalImage,
                    0, originalImage.height - singleLineHeight, // Source X, Y (bottom strip from original image)
                    originalImage.width, singleLineHeight,      // Source W, H (a strip of singleLineHeight)
                    0, 0,                                       // Destination X, Y (top-left of pattern canvas)
                    bgPatternCanvas.width, bgPatternCanvas.height // Destination W, H (pattern canvas is singleLineHeight tall, so this fills it)
                );
            } else {
                // No, original image is shorter than singleLineHeight or has zero width.
                // Fallback to a default background (e.g., black) for the pattern canvas.
                bgCtx.fillStyle = '#000000'; // Default background
                bgCtx.fillRect(0, 0, bgPatternCanvas.width, bgPatternCanvas.height);
            }
        }

        // Prepare text styling for subtitles
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw each subtitle line below the original image
        subtitles.forEach((line, index) => {
            const subtitleLineStartY = originalImage.height + (index * singleLineHeight);
            const lineCenterY = subtitleLineStartY + (singleLineHeight / 2);

            // Draw background for the current subtitle line using the prepared pattern
            if (bgPatternCanvas) {
                ctx.drawImage(bgPatternCanvas, 0, subtitleLineStartY);
            }

            // Draw text outline (stroke)
            if (outlineWidth > 0) {
                ctx.strokeStyle = outlineColor;
                ctx.lineWidth = outlineWidth;
                ctx.strokeText(line, canvas.width / 2, lineCenterY);
            }

            // Draw text fill
            ctx.fillStyle = fontColor;
            ctx.fillText(line, canvas.width / 2, lineCenterY);
        });

        saveButton.disabled = false;
        console.log('字幕图片已生成');
    });

    saveButton.addEventListener('click', () => {
        if (!originalImage || saveButton.disabled) {
            alert('请先生成字幕图片！');
            return;
        }
        const imageName = originalImage.src.split('/').pop().split('.')[0] || 'image';
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${imageName}_subtitled.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('图片已保存');
    });
});