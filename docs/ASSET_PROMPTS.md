# Danh sách ảnh và âm thanh cần tạo

File này sinh tự động từ `src/content/assets.ts` bằng `npm run prompts`. ✅ là đã có file, ⬜ là còn thiếu.

## Cách làm

1. **Ảnh (ChatGPT):** dán prompt, chọn đúng kích thước. Ảnh nhân vật, huy hiệu, avatar cần **nền trong suốt** (nói rõ "transparent background", xuất PNG).
2. Đặt file vào `public/assets/img/` với **đúng tên** (đuôi .webp, .png hoặc .jpg đều được; .webp nhẹ nhất, đổi bằng squoosh.app).
3. **Âm thanh (ElevenLabs):** hiệu ứng dùng *Sound Effects*, lời đọc dùng *Text to Speech*. Lưu `.mp3` đúng tên vào `public/assets/sfx/` hoặc `public/assets/voice/`.
4. Chạy `npm run dev` (hoặc deploy lại) là app tự dùng file mới; file nào chưa có thì app hiện hình thay thế.

**Giữ nhân vật đồng nhất:** tạo `mochi-happy` trước, sau đó đính kèm ảnh đó vào ChatGPT khi tạo các ảnh khác có Mochi và nói "same character as the attached image".

### Phong cách chung (đã gắn sẵn vào cuối mỗi prompt)

> Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark

### Phong cách lớp lớn (lớp 8, 9 trở lên): anime trưởng thành, chất công nghệ

> Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark

### Nhân vật

- Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator
- Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs

## Ảnh (98)

### ✅ `mochi-happy.webp`
- Dùng ở: Mochi vui vẻ: lời chào, slide mở đầu
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, waving one paw and smiling, full body. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `mochi-think.webp`
- Dùng ở: Mochi suy nghĩ: slide giải thích
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, paw on chin, thinking, small question mark sparkle above head, full body. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `mochi-wow.webp`
- Dùng ở: Mochi ngạc nhiên: mẹo hay, phím mới
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, eyes wide with stars, both paws up in surprise, full body. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `mochi-cheer.webp`
- Dùng ở: Mochi cổ vũ: trả lời đúng, hoàn thành bài
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, jumping with joy, confetti around, full body. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `mochi-oops.webp`
- Dùng ở: Mochi an ủi: trả lời sai
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, sweat drop, sheepish encouraging smile, holding a tiny eraser, full body. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `xixi.webp`
- Dùng ở: Xi Xi: thẻ môn FX580, trang giới thiệu
- Kích thước: 1024x1024 · nền trong suốt

```text
Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs, standing and giving a thumbs up, full body. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `bg-home.webp`
- Dùng ở: Cảnh nền màn hình Học (trang chủ), tràn toàn màn hình phía sau nội dung
- Kích thước: 1536x1024

```text
Wide landscape of a dreamy morning sky over gentle green hills and a cute small school building far away, soft clouds, floating paper planes, large calm empty sky area in the upper middle for text, low detail at the edges. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `bg-map.webp`
- Dùng ở: Cảnh nền bản đồ bài học FX580, phía sau con đường bài học
- Kích thước: 1536x1024

```text
Wide storybook landscape seen slightly from above: meadows, a small river with a wooden bridge, scattered trees, a hill with a flag far away, very soft and low contrast so icons on top stay readable, no path drawn. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `bg-lesson.webp`
- Dùng ở: Cảnh nền khi học bài, luyện tập, kiểm tra (rất nhạt để đọc chữ)
- Kích thước: 1536x1024

```text
Cozy study corner by a big window: wooden desk, a few books, a plant, warm afternoon light, background heavily blurred and very light, mostly empty bright space. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `bg-arena.webp`
- Dùng ở: Cảnh nền trang Thi đấu và phòng thi
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator and two friend animals (a fox and a bunny) racing with calculators on a sunny sports field with colorful flags, characters on the left third, open bright sky on the right for text, dynamic but gentle. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `bg-leaderboard.webp`
- Dùng ở: Cảnh nền trang Xếp hạng
- Kích thước: 1536x1024

```text
Festive outdoor stage at dusk with a podium of three steps, small trophies, bunting flags and twinkling stars, podium on the lower left, open sky for text. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `subject-fx580-cover.webp`
- Dùng ở: Ảnh lớn của môn Máy tính FX580 ở trang chủ (chữ đè lên phần dưới ảnh)
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator sitting next to Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs on a desk with notebooks and pencils, numbers floating like bubbles. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `subject-soon.webp`
- Dùng ở: Thẻ môn sắp ra mắt
- Kích thước: 1536x1024

```text
A closed gift box with a ribbon on a cloud, small sparkles, mysterious and cute. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `empty-login.webp`
- Dùng ở: Màn hình mời đăng nhập
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator holding a key and smiling at a small door. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `level-mam.webp`
- Dùng ở: Huy hiệu trình độ Hạt mầm
- Kích thước: 1024x1024 · nền trong suốt

```text
Round badge with a tiny sprout in soil, soft green and cream. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `level-choi.webp`
- Dùng ở: Huy hiệu trình độ Chồi non
- Kích thước: 1024x1024 · nền trong suốt

```text
Round badge with a young plant with three leaves, soft green. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `level-cay.webp`
- Dùng ở: Huy hiệu trình độ Cây xanh
- Kích thước: 1024x1024 · nền trong suốt

```text
Round badge with a small lush tree, soft green and sky blue. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `level-hoa.webp`
- Dùng ở: Huy hiệu trình độ Cây nở hoa
- Kích thước: 1024x1024 · nền trong suốt

```text
Round badge with a tree in full pink blossom, sparkles. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `avatar-fox.webp`
- Dùng ở: Ảnh đại diện: fox
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi fox face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `avatar-bunny.webp`
- Dùng ở: Ảnh đại diện: bunny
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi bunny face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `avatar-panda.webp`
- Dùng ở: Ảnh đại diện: panda
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi panda face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `avatar-owl.webp`
- Dùng ở: Ảnh đại diện: owl
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi owl face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `avatar-bear.webp`
- Dùng ở: Ảnh đại diện: bear
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi bear face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `avatar-penguin.webp`
- Dùng ở: Ảnh đại diện: penguin
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi penguin face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `fx-l01-cover.webp`
- Dùng ở: Bìa bài 1: Làm quen với Xi Xi
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator shaking hands with Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs on a sunny desk. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l02-cover.webp`
- Dùng ở: Bìa bài 2: Thứ tự phép tính
- Kích thước: 1536x1024

```text
Cute operator symbols (+, −, ×, ÷ and parentheses) standing in a queue like children lining up, the parentheses at the front. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l03-cover.webp`
- Dùng ở: Bìa bài 3: Lũy thừa
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator riding a small rocket that leaves a trail of doubling stars. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l04-cover.webp`
- Dùng ở: Bìa bài 4: Chia có dư
- Kích thước: 1536x1024

```text
Colorful candies being shared into seven small bowls, two candies left over in the middle. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l05-cover.webp`
- Dùng ở: Bìa bài 5: Số nguyên tố
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator as a detective with a magnifying glass looking at glowing prime number gems 2, 3, 5, 7. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l06-cover.webp`
- Dùng ở: Bìa bài 6: ƯCLN, BCNN
- Kích thước: 1536x1024

```text
Gift boxes split into equal groups on one side and two blinking lighthouses on the other side. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l07-cover.webp`
- Dùng ở: Bìa bài 7: Số nguyên âm
- Kích thước: 1536x1024

```text
A cute thermometer character standing in snowy mountains, a small submarine below the sea surface in the same scene. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l08-cover.webp`
- Dùng ở: Bìa bài 8: Phân số
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator with a pizza cut into 8 slices, three slices taken. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l09-cover.webp`
- Dùng ở: Bìa bài 9: Thập phân và phần trăm
- Kích thước: 1536x1024

```text
A cozy little stationery shop with discount tags showing a percent symbol. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l10-cover.webp`
- Dùng ở: Bìa bài 10: Chu vi, diện tích
- Kích thước: 1536x1024

```text
A garden seen from above divided into rectangle, rhombus, parallelogram and trapezoid flower beds. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx7-l01-cover.webp`
- Dùng ở: Lớp 7 · Bìa bài 1: Số hữu tỉ
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator standing on a number line that stretches left into cool blue ice (negative numbers) and right into warm sunshine, holding a glowing fraction-shaped ice cube. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx7-l02-cover.webp`
- Dùng ở: Lớp 7 · Bìa bài 2: Lũy thừa số hữu tỉ
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator and Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs riding a small rocket that grows bigger in stages like a staircase, playful sense of rapid growth, pair of curved brackets shaped like a protective bubble around the rocket. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx7-l03-cover.webp`
- Dùng ở: Lớp 7 · Bìa bài 3: Căn bậc hai
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator kneeling in a square vegetable garden, measuring one side with a ribbon tape, a sprouting plant with visible roots growing under the soil. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx7-l04-cover.webp`
- Dùng ở: Lớp 7 · Bìa bài 4: Tỉ lệ thức
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator balancing a wooden seesaw scale with two equal groups of fruit on each side, Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs watching cheerfully. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx7-l05-cover.webp`
- Dùng ở: Lớp 7 · Bìa bài 5: Đại lượng tỉ lệ
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator and three animal friends sharing a big layered cake cut into slices of different sizes, a stack of notebooks nearby. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx7-l06-cover.webp`
- Dùng ở: Lớp 7 · Bìa bài 6: Thống kê
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator presenting a big colorful pie chart and a simple bar chart on a classroom easel, Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs pointing at the chart. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx8-l01-cover.webp`
- Dùng ở: Lớp 8 · Bìa bài 1: Giá trị đa thức
- Kích thước: 1536x1024

```text
The student in a high-tech lab inserting a glowing value into a floating holographic machine, curved data streams flowing out the other side, a futuristic scientific calculator with a glowing holographic display projecting light above it on the desk. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx8-l02-cover.webp`
- Dùng ở: Lớp 8 · Bìa bài 2: Hằng đẳng thức
- Kích thước: 1536x1024

```text
The student casting a glowing spell from fingertips, a large square splitting into four neon tiles (two squares, two rectangles) that rearrange in mid-air. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx8-l03-cover.webp`
- Dùng ở: Lớp 8 · Bìa bài 3: Phương trình bậc nhất
- Kích thước: 1536x1024

```text
The student at night in front of a futuristic vault door with a glowing balance-scale lock, reaching out to turn a holographic dial, city lights behind. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx8-l04-cover.webp`
- Dùng ở: Lớp 8 · Bìa bài 4: Định lí Pythagore
- Kích thước: 1536x1024

```text
The student standing on a rooftop at dusk next to a giant glowing right triangle made of light beams, three translucent square panels attached to its sides. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx8-l05-cover.webp`
- Dùng ở: Lớp 8 · Bìa bài 5: Hàm số bậc nhất
- Kích thước: 1536x1024

```text
The student riding an electric scooter along a straight neon road rising across a dark grid like a graph line, distance markers glowing along the road. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx8-l06-cover.webp`
- Dùng ở: Lớp 8 · Bìa bài 6: Xác suất
- Kích thước: 1536x1024

```text
The student flicking a glowing coin into the air while a translucent die spins mid-air, faint probability arcs and particles around, game-arcade lighting. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx9-l01-cover.webp`
- Dùng ở: Lớp 9 · Bìa bài 1: Căn bậc hai, căn bậc ba
- Kích thước: 1536x1024

```text
The student examining a glowing translucent cube built from smaller cubes floating above an open palm, a digital tree with deep luminous roots in the background. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx9-l02-cover.webp`
- Dùng ở: Lớp 9 · Bìa bài 2: Hệ phương trình
- Kích thước: 1536x1024

```text
The student as a sharp detective in a dark room studying a holographic map where two neon lines cross at one bright point. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx9-l03-cover.webp`
- Dùng ở: Lớp 9 · Bìa bài 3: Phương trình bậc hai
- Kích thước: 1536x1024

```text
The student riding a sleek roller coaster whose track is a smooth glowing U-shaped parabola crossing a neon ground line at two points, night sky. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx9-l04-cover.webp`
- Dùng ở: Lớp 9 · Bìa bài 4: Tỉ số lượng giác
- Kích thước: 1536x1024

```text
The student on a rooftop aiming a futuristic rangefinder at a tall tower, a glowing right triangle and angle arc projected between them. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx9-l05-cover.webp`
- Dùng ở: Lớp 9 · Bìa bài 5: Đường tròn
- Kích thước: 1536x1024

```text
The student standing inside a huge glowing circular ring of light, holographic arcs and a sector highlighted in mint, sci-fi plaza at night. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `fx9-l06-cover.webp`
- Dùng ở: Lớp 9 · Bìa bài 6: Hình trụ, nón, cầu
- Kích thước: 1536x1024

```text
The student in a design studio with three holographic wireframe solids floating above the desk: a cylinder, a cone and a sphere, soft neon lighting. Characters: a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck; Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder. Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark.
```

### ✅ `subject-tapdoc-cover.webp`
- Dùng ở: Ảnh lớn của môn Tập đọc ở trang chủ (chữ đè lên phần dưới ảnh)
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, sitting on a stack of big picture books, holding an open book, a few large soft wooden alphabet blocks around (blank faces, no letters), warm reading nook. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `td-cover.webp`
- Dùng ở: Ảnh chung cho thẻ "Học tiếp" của môn Tập đọc (chữ to đè lên)
- Kích thước: 1536x1024

```text
A cozy empty classroom blackboard corner with soft chalk dust, a small potted plant and a stack of books, large plain empty area in the middle, very soft and light. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `mochi-read.webp`
- Dùng ở: Mochi đọc sách: màn hình bé ghi âm đọc to
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, holding an open book and reading aloud with a small music-note sparkle near its mouth, one ear perked up as if listening, full body. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `fx-l01-s1.webp`
- Dùng ở: Bài 1, slide 1: Mochi giới thiệu Xi Xi
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator presenting Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs with open paws, sparkles. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l01-s3.webp`
- Dùng ở: Bài 1, slide 3: chữ vàng chữ đỏ trên phím
- Kích thước: 1536x1024

```text
Close-up of three calculator keys, each with a small yellow label and a small red label above it, glowing softly, two tiny arrows pointing to the labels. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l02-s1.webp`
- Dùng ở: Bài 2, slide 1: luật xếp hàng phép tính
- Kích thước: 1536x1024

```text
Four podium steps labelled with icons: parentheses on top, then a power symbol, then × ÷, then + −, cute characters on each step. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l02-s4.webp`
- Dùng ở: Bài 2, slide 4: mẹ đi chợ
- Kích thước: 1536x1024

```text
A mother cat and Mochi at a Vietnamese wet market stall with oranges and bundles of vegetables. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l03-s1.webp`
- Dùng ở: Bài 3, slide 1: lũy thừa nhân đôi
- Kích thước: 1536x1024

```text
A row of five boxes, each containing twice as many glowing marbles as the one before. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l04-s1.webp`
- Dùng ở: Bài 4, slide 1: chia kẹo
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator handing out candies to seven classmates sitting in a circle, two candies left. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l05-s1.webp`
- Dùng ở: Bài 5, slide 1: số nguyên tố là viên đá quý
- Kích thước: 1536x1024

```text
Glowing gemstones with numbers 2, 3, 5, 7, 11 inside, and ordinary pebbles with 4, 6, 9 beside them. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l06-s1.webp`
- Dùng ở: Bài 6, slide 1: GCD và LCM
- Kích thước: 1536x1024

```text
Two cute twin robot characters with badges, one badge shows a gift box, the other shows a clock. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l06-s4.webp`
- Dùng ở: Bài 6, slide 4: chia giỏ trái cây
- Kích thước: 1536x1024

```text
Twelve equal baskets each with oranges and tangerines, arranged neatly on a table. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l07-s1.webp`
- Dùng ở: Bài 7, slide 1: số âm quanh ta
- Kích thước: 1536x1024

```text
Split scene: snowy mountain town with a thermometer below zero on the left, a submarine underwater with a depth gauge on the right. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l08-s1.webp`
- Dùng ở: Bài 8, slide 1: bánh pizza 3/8
- Kích thước: 1536x1024

```text
A round pizza cut into 8 equal slices, 3 slices slightly pulled out, top view. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l09-s2.webp`
- Dùng ở: Bài 9, slide 2: làm tròn số
- Kích thước: 1536x1024

```text
A number line like a little road with a ball rolling to the nearest flag, gentle hills. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l09-s4.webp`
- Dùng ở: Bài 9, slide 4: mua giày giảm giá
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator trying on sneakers in a shop, a big sale tag nearby. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l10-s1.webp`
- Dùng ở: Bài 10, slide 1: các hình
- Kích thước: 1536x1024

```text
Five friendly shape characters: rectangle, square, rhombus, parallelogram, isosceles trapezoid, standing together. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `fx-l10-s3.webp`
- Dùng ở: Bài 10, slide 3: rào sân
- Kích thước: 1536x1024

```text
A rectangular schoolyard with a small wooden fence being built around it, top-down three-quarter view. Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark.
```

### ✅ `bit-happy.webp`
- Dùng ở: Thỏ Bit chào: slide mở đầu môn Gõ phím (tạo ảnh này TRƯỚC, các ảnh Bit khác lấy làm mẫu)
- Kích thước: 1024x1024 · nền trong suốt

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile, standing relaxed and giving a small two-finger salute, full body. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `bit-think.webp`
- Dùng ở: Bit suy nghĩ: slide giải thích
- Kích thước: 1024x1024 · nền trong suốt

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile, one hand touching the visor which shows a tiny holographic keyboard, thinking, full body. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `bit-wow.webp`
- Dùng ở: Bit ngạc nhiên: phím mới, mẹo hay
- Kích thước: 1024x1024 · nền trong suốt

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile, visor glowing pink, ears straight up in surprise, both hands open, full body. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `bit-cheer.webp`
- Dùng ở: Bit ăn mừng: hoàn thành, thắng cuộc
- Kích thước: 1024x1024 · nền trong suốt

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile, jumping with a fist pump, neon sparks around, full body. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `bit-oops.webp`
- Dùng ở: Bit an ủi: thua lượt, gõ sai nhiều
- Kích thước: 1024x1024 · nền trong suốt

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile, scratching the back of the head with a lopsided grin, visor showing a small glitch, full body. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-bit-diver.webp`
- Dùng ở: Thợ lặn trong game cá mập (bên trái màn hình, nhìn sang phải)
- Kích thước: 1024x1024 · nền trong suốt

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile in a sleek dark-navy diving suit with cyan neon lines, round glass helmet around the head with the ears inside, small oxygen tank on the back, holding a laser blaster shaped like a compact keyboard pointing to the RIGHT, floating underwater, side three-quarter view facing right. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-fish.webp`
- Dùng ở: Cá nhỏ trong game (mang 1-3 chữ cái)
- Kích thước: 1024x1024 · nền trong suốt

```text
A small sleek robotic piranha-like fish with amber glowing fins, side view, swimming toward the LEFT (head on the left), a large flat dark plate in the middle of the body left empty for a word label, glowing neon outline. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-jelly.webp`
- Dùng ở: Sứa trong game (mang 1-3 chữ cái)
- Kích thước: 1024x1024 · nền trong suốt

```text
A cyber jellyfish with a violet translucent dome and glowing pink circuit tentacles, front view, the dome has a darker flat center area for a short word label. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-hands.webp`
- Dùng ở: Hai bàn tay nét mảnh đặt trên bàn phím ảo (chế độ Ngón tay ảo). App tự canh đầu ngón út trùng phím A và ;
- Kích thước: 1536x1024 · nền trong suốt

```text
Two human hands seen from directly above in the classic touch-typing home-row position, as in a typing-tutor diagram: the eight fingertips rest in one straight horizontal row across the image at about 30% from the top, evenly spaced, left pinky fingertip at about 12% from the left edge and right pinky fingertip at about 88%; fingers gently curved and relaxed, natural proportions (middle finger longest, pinky shortest); both thumbs rest a little lower near the center pointing slightly toward each other; wrists and forearms continue straight down to the bottom edge; left and right hands mirror each other. Elegant minimal line drawing: one smooth continuous thin white outline (about 3 px), no fill, no shading, no color, no fingernails detail, no keyboard, no background objects, clean vector look like a premium app icon guide, no text, no letters, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-shark.webp`
- Dùng ở: Cá mập máy (mang một từ)
- Kích thước: 1536x1024 · nền trong suốt

```text
A cool mechanical shark with dark navy armor plates, cyan glowing gill lines and a red glowing eye, sharp but not gory, side view, swimming toward the LEFT (head on the left), a large flat dark plate in the middle of the body left empty for a word label, glowing neon outline. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-boss.webp`
- Dùng ở: Cá mập trùm (mang từ dài, câu)
- Kích thước: 1536x1024 · nền trong suốt

```text
A huge boss mechanical shark with magenta neon armor, glowing pink eyes, spiky dorsal fin like a radio antenna, menacing but kid-friendly, side view, swimming toward the LEFT (head on the left), a large flat dark plate in the middle of the body left empty for a word label, glowing neon outline. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `bg-gp-deep.webp`
- Dùng ở: Cảnh nền game cá mập: biển sâu (để trống giữa cho cá bơi qua)
- Kích thước: 1536x1024

```text
Wide underwater scene in the deep ocean at night: soft god rays from the surface at the top, a far-away glowing cyber city of coral towers on the seabed at the bottom, floating particles, the middle band left mostly empty and dark-blue so fish sprites and labels stay readable, low contrast at the center. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark.
```

### ✅ `bg-gp-map.webp`
- Dùng ở: Cảnh nền bản đồ bài của môn Gõ phím
- Kích thước: 1536x1024

```text
Top-down view of a deep-sea cyber city: glowing neon coral reefs, light trails on the seabed like circuit boards, small submarine docks, very dark and low contrast so map nodes on top stay readable. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark.
```

### ✅ `bg-gp-lesson.webp`
- Dùng ở: Cảnh nền bài học, kiểm tra của môn Gõ phím (rất tối, mờ)
- Kích thước: 1536x1024

```text
Inside a cozy high-tech submarine control room with a big round window showing the dark ocean, keyboard consoles with soft cyan glow, background heavily blurred and dark, mostly empty. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark.
```

### ✅ `subject-gophim-cover.webp`
- Dùng ở: Ảnh lớn môn Gõ phím ở trang chủ (chữ đè lên phần dưới ảnh)
- Kích thước: 1536x1024

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile as a diver aiming a keyboard laser blaster at a mechanical shark charging in from the right, letters glowing on the shark's side, deep ocean with neon light rays, dynamic action pose, upper half has the action, lower third darker for text. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark.
```

### ✅ `bg-gp-race.webp`
- Dùng ở: Cảnh nền đường đua (chế độ Đua xe)
- Kích thước: 1536x1024

```text
A neon hover-car race track inside a glass tunnel under the sea, track lanes glowing cyan and pink seen from the side, fish swimming outside the tunnel, the track runs horizontally across the image, dark background. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark.
```

### ✅ `gp-car.webp`
- Dùng ở: Xe đua trong chế độ Đua xe (app tự đổi màu cho từng bạn)
- Kích thước: 1536x1024 · nền trong suốt

```text
A sleek futuristic hover race car, side view facing RIGHT, white and silver body with glowing cyan underlights and a small bubble cockpit, no driver visible, no numbers. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-mode-survival.webp`
- Dùng ở: Biểu tượng chế độ Sinh tồn
- Kích thước: 1024x1024 · nền trong suốt

```text
Round app-icon style badge: a mechanical shark head with glowing red eye bursting through a ring of three neon hearts. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-mode-passage.webp`
- Dùng ở: Biểu tượng chế độ Bài gõ hay
- Kích thước: 1024x1024 · nền trong suốt

```text
Round app-icon style badge: a glowing holographic scroll of paper floating above a neon keyboard. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-mode-race.webp`
- Dùng ở: Biểu tượng chế độ Đua xe
- Kích thước: 1024x1024 · nền trong suốt

```text
Round app-icon style badge: a neon hover race car crossing a checkered finish line. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-tier-1.webp`
- Dùng ở: Huy hiệu trình độ Hàng nhà
- Kích thước: 1024x1024 · nền trong suốt

```text
Hexagon tech badge with two glowing keycaps side by side, each with a small raised bump, cyan glow. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-tier-2.webp`
- Dùng ở: Huy hiệu trình độ Từng bàn tay
- Kích thước: 1024x1024 · nền trong suốt

```text
Hexagon tech badge with a robotic glove hand outline made of neon lines, violet glow. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-tier-3.webp`
- Dùng ở: Huy hiệu trình độ Phối hợp
- Kích thước: 1024x1024 · nền trong suốt

```text
Hexagon tech badge with two neon hands crossing over a keyboard, pink and cyan glow. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-tier-4.webp`
- Dùng ở: Huy hiệu trình độ Telex (gõ tiếng Việt)
- Kích thước: 1024x1024 · nền trong suốt

```text
Hexagon tech badge with a glowing keycap that has a small hook and hat accent marks floating above it like Vietnamese diacritics, amber glow, no real letters. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark, isolated on a fully transparent background.
```

### ✅ `gp-cover-nha.webp`
- Dùng ở: Bìa các bài Hàng nhà (thẻ Học tiếp)
- Kích thước: 1536x1024

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile resting both hands on the middle row of a giant glowing keyboard that lies on the seabed like a dance floor. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark.
```

### ✅ `gp-cover-tay.webp`
- Dùng ở: Bìa các bài Từng bàn tay
- Kích thước: 1536x1024

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile reaching up to a glowing top-row key and down to a bottom-row key of a giant neon keyboard, underwater. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark.
```

### ✅ `gp-cover-phoi.webp`
- Dùng ở: Bìa các bài Phối hợp
- Kích thước: 1536x1024

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile typing fast with both hands on a holographic keyboard, light trails following the fingers, a school of neon fish swirling around. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark.
```

### ✅ `gp-cover-telex.webp`
- Dùng ở: Bìa các bài Telex
- Kích thước: 1536x1024

```text
Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile in a submarine cockpit typing, glowing Vietnamese-style accent marks (hooks, hats, tone marks) floating like bubbles, no full words. Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark.
```

## Âm thanh (63)

Cài đặt giọng đọc gợi ý: ElevenLabs Text to Speech, model Multilingual v2 hoặc v3, giọng nữ trẻ ấm áp (vd. chọn giọng tiếng Việt trong Voice Library), stability ~50%, style thấp, tốc độ chậm vừa. Xuất MP3 44.1kHz.

| | File | Loại | Dùng ở | Prompt / lời đọc |
|---|---|---|---|---|
| ✅ | `sfx/tap.mp3` | Hiệu ứng | Chạm phím máy tính ảo, nút bấm | Soft short plastic button click, gentle, 0.1 seconds |
| ✅ | `sfx/correct.mp3` | Hiệu ứng | Trả lời đúng | Cheerful bright two-note chime, soft xylophone, 0.6 seconds |
| ✅ | `sfx/wrong.mp3` | Hiệu ứng | Trả lời sai | Gentle low wooden 'bonk', friendly, not harsh, 0.4 seconds |
| ✅ | `sfx/complete.mp3` | Hiệu ứng | Hoàn thành bài học / luyện tập | Short magical sparkle fanfare with soft bells, 2 seconds |
| ✅ | `sfx/levelup.mp3` | Hiệu ứng | Kết quả kiểm tra trình độ, lên cấp | Uplifting harp glissando followed by a soft chime, 2.5 seconds |
| ✅ | `sfx/tick.mp3` | Hiệu ứng | Đếm ngược 3 giây cuối khi thi đấu | Soft clock tick, single, 0.2 seconds |
| ✅ | `sfx/whoosh.mp3` | Hiệu ứng | Chuyển slide | Very soft paper whoosh, 0.3 seconds |
| ✅ | `sfx/bgm-learn.mp3` | Nhạc | Nhạc nền khi học bài, làm bài (môn Máy tính, Tập đọc) | Calm lo-fi acoustic loop for children studying, soft piano and ukulele, 80 bpm, seamless loop, 60 seconds |
| ✅ | `sfx/bgm-home.mp3` | Nhạc | Nhạc nền trang chủ, bản đồ bài, xếp hạng | Light cheerful adventure loop for a kids learning app menu, gentle marimba, soft pizzicato strings and light bells, warm and curious mood, 95 bpm, no vocals, no big drums, seamless loop, 60 seconds |
| ✅ | `sfx/bgm-gp.mp3` | Nhạc | Nhạc nền môn Gõ phím: bản đồ, bài học, bài gõ hay (cyber, tập trung) | Chill synthwave lo-fi loop for focused typing practice, soft analog synth pads, mellow arpeggio, light muted beat, deep-sea cyber city mood, 85 bpm, no vocals, unobtrusive, seamless loop, 75 seconds |
| ✅ | `sfx/bgm-gp-game.mp3` | Nhạc | Nhạc nền game cá mập và chế độ sinh tồn | Upbeat underwater electronic action loop for a kids typing game, bubbly synth bass, plucky arpeggios, light driving drums, sonar pings, exciting but not stressful, 120 bpm, no vocals, seamless loop, 75 seconds |
| ✅ | `sfx/bgm-arena.mp3` | Nhạc | Nhạc nền phòng thi đấu (đua xe gõ phím, thi máy tính) | Energetic competition loop for kids, bright synth lead, punchy but soft drums, racing countdown energy, positive and fun, 128 bpm, no vocals, seamless loop, 60 seconds |
| ✅ | `voice/vo-l01-s1.mp3` | Giọng đọc | Bài 1, slide 1 | Chào em, tớ là Mochi! Đây là bạn đồng hành mới của chúng mình, máy tính Casio fx năm tám mươi V N X. Tớ gọi bạn ấy là Xi Xi. Cùng làm quen nhé! |
| ✅ | `voice/vo-l01-s2.mp3` | Giọng đọc | Bài 1, slide 2 | Bấm ON để bật máy. Phím AC xóa hết để làm phép tính mới, còn phím DEL chỉ xóa một chữ số thôi. |
| ✅ | `voice/vo-l01-s3.mp3` | Giọng đọc | Bài 1, slide 3 | Em có thấy chữ nhỏ màu vàng và màu đỏ trên phím không? Bấm SHIFT để dùng chữ vàng, bấm ALPHA để dùng chữ đỏ. |
| ✅ | `voice/vo-l01-s4.mp3` | Giọng đọc | Bài 1, slide 4 | Nếu máy hiện kết quả lạ, em có thể đưa máy về cài đặt gốc. Nhưng nhớ là bộ nhớ sẽ bị xóa đó. |
| ✅ | `voice/vo-l01-s5.mp3` | Giọng đọc | Bài 1, slide 5 | Giờ thử phép tính đầu tiên nhé. Em chạm vào các phím theo đúng thứ tự, rồi bấm bằng. |
| ✅ | `voice/vo-l02-s1.mp3` | Giọng đọc | Bài 2, slide 1 | Các phép tính cũng phải xếp hàng đấy. Trong ngoặc trước, rồi lũy thừa, rồi nhân chia, cuối cùng mới đến cộng trừ. |
| ✅ | `voice/vo-l02-s4.mp3` | Giọng đọc | Bài 2, slide 4 | Đi chợ cùng mẹ nào! Em chỉ cần viết thành một biểu thức, rồi gõ liền một lần vào máy. |
| ✅ | `voice/vo-l03-s1.mp3` | Giọng đọc | Bài 3, slide 1 | Lũy thừa là nhân một số với chính nó nhiều lần. Hai mũ năm là hai nhân hai nhân hai nhân hai nhân hai, bằng ba mươi hai. |
| ✅ | `voice/vo-l04-s1.mp3` | Giọng đọc | Bài 4, slide 1 | Một trăm cái kẹo chia cho bảy bạn. Mỗi bạn được mười bốn cái, còn dư hai cái. Xi Xi tính việc này chỉ trong một lần bấm. |
| ✅ | `voice/vo-l05-s1.mp3` | Giọng đọc | Bài 5, slide 1 | Số nguyên tố giống như viên đá quý, chỉ chia hết cho một và chính nó. Hôm nay mình làm thám tử đi tìm chúng nhé. |
| ✅ | `voice/vo-l06-s1.mp3` | Giọng đọc | Bài 6, slide 1 | Gặp hai người bạn mới: GCD là ước chung lớn nhất, LCM là bội chung nhỏ nhất. Họ sống trên phím nhân và phím chia. |
| ✅ | `voice/vo-l06-s4.mp3` | Giọng đọc | Bài 6, slide 4 | Chia đều, nhiều nhất thì nghĩ đến ước chung lớn nhất. Lặp lại, gặp nhau lần tới thì nghĩ đến bội chung nhỏ nhất. |
| ✅ | `voice/vo-l07-s1.mp3` | Giọng đọc | Bài 7, slide 1 | Ở Sa Pa có khi lạnh dưới không độ. Những con số nhỏ hơn không gọi là số âm. Xi Xi có phím riêng cho dấu âm đó. |
| ✅ | `voice/vo-l08-s1.mp3` | Giọng đọc | Bài 8, slide 1 | Chiếc bánh cắt thành tám miếng, em ăn ba miếng, vậy em đã ăn ba phần tám cái bánh. |
| ✅ | `voice/vo-l09-s1.mp3` | Giọng đọc | Bài 9, slide 1 | Mình viết ba phẩy năm, nhưng trên máy em bấm dấu chấm nhé. Hai cách viết là một số thôi. |
| ✅ | `voice/vo-l09-s4.mp3` | Giọng đọc | Bài 9, slide 4 | Đôi giày đang giảm giá hai mươi phần trăm. Cùng tính xem còn phải trả bao nhiêu tiền nào. |
| ✅ | `voice/vo-l10-s1.mp3` | Giọng đọc | Bài 10, slide 1 | Đây là bảng công thức chu vi và diện tích. Em không cần học thuộc ngay, cứ xem lại mỗi khi cần nhé. |
| ✅ | `voice/vo-l10-s3.mp3` | Giọng đọc | Bài 10, slide 3 | Rào xung quanh là chu vi, còn lát nền là diện tích. Đọc kỹ đề trước khi bấm máy nhé. |
| ⬜ | `voice/vo7-l01.mp3` | Giọng đọc | Lớp 7 · Bài 1, câu chào | Chào mừng em lên lớp 7! Hôm nay mình làm quen với số hữu tỉ nhé. |
| ⬜ | `voice/vo7-l02.mp3` | Giọng đọc | Lớp 7 · Bài 2, câu chào | Cẩn thận cái bẫy dấu ngoặc nha, lũy thừa số âm dễ nhầm lắm đó! |
| ⬜ | `voice/vo7-l03.mp3` | Giọng đọc | Lớp 7 · Bài 3, câu chào | Hôm nay Xi Xi chỉ em phím căn bậc hai và cách làm tròn số. |
| ⬜ | `voice/vo7-l04.mp3` | Giọng đọc | Lớp 7 · Bài 4, câu chào | Hai tỉ số bằng nhau gọi là tỉ lệ thức. Nhân chéo là ra ngay! |
| ⬜ | `voice/vo7-l05.mp3` | Giọng đọc | Lớp 7 · Bài 5, câu chào | Cùng tăng hay ngược chiều? Mình tìm hiểu đại lượng tỉ lệ nào. |
| ⬜ | `voice/vo7-l06.mp3` | Giọng đọc | Lớp 7 · Bài 6, câu chào | Điểm trung bình của em là bao nhiêu? Bấm máy tính thử xem! |
| ⬜ | `voice/vo8-l01.mp3` | Giọng đọc | Lớp 8 · Bài 1, câu chào | Chào mừng em lên lớp 8! Hôm nay mình thay số vào đa thức nhé. |
| ⬜ | `voice/vo8-l02.mp3` | Giọng đọc | Lớp 8 · Bài 2, câu chào | Bảy hằng đẳng thức giống bảy câu thần chú tính nhanh đó! |
| ⬜ | `voice/vo8-l03.mp3` | Giọng đọc | Lớp 8 · Bài 3, câu chào | Cùng đi tìm x nào. Chuyển vế xong, Xi Xi tính hộ cho! |
| ⬜ | `voice/vo8-l04.mp3` | Giọng đọc | Lớp 8 · Bài 4, câu chào | Tam giác vuông có một bí mật tên là định lí Pythagore. |
| ⬜ | `voice/vo8-l05.mp3` | Giọng đọc | Lớp 8 · Bài 5, câu chào | Hàm số giống một cỗ máy: bỏ x vào, ra y. |
| ⬜ | `voice/vo8-l06.mp3` | Giọng đọc | Lớp 8 · Bài 6, câu chào | Gieo xúc xắc, tung đồng xu. Hôm nay mình học xác suất! |
| ⬜ | `voice/vo9-l01.mp3` | Giọng đọc | Lớp 9 · Bài 1, câu chào | Chào mừng em lên lớp 9! Mình gặp căn bậc ba nhé. |
| ⬜ | `voice/vo9-l02.mp3` | Giọng đọc | Lớp 9 · Bài 2, câu chào | Hai manh mối, hai ẩn số. Cùng giải hệ phương trình nào! |
| ⬜ | `voice/vo9-l03.mp3` | Giọng đọc | Lớp 9 · Bài 3, câu chào | Delta quyết định phương trình bậc hai có mấy nghiệm đó. |
| ⬜ | `voice/vo9-l04.mp3` | Giọng đọc | Lớp 9 · Bài 4, câu chào | Sin, cos, tan nghe khó nhưng Xi Xi bấm một cái là ra. |
| ⬜ | `voice/vo9-l05.mp3` | Giọng đọc | Lớp 9 · Bài 5, câu chào | Số pi thần kỳ đang trốn trên phím của Xi Xi đó! |
| ⬜ | `voice/vo9-l06.mp3` | Giọng đọc | Lớp 9 · Bài 6, câu chào | Lon nước, que kem, quả bóng: mình tính thể tích các khối tròn nhé. |
| ✅ | `voice/vo-correct-3.mp3` | Giọng đọc | Khen khi đúng (ngẫu nhiên) | Đúng rồi, em bấm máy giỏi ghê! |
| ✅ | `voice/vo-correct-1.mp3` | Giọng đọc | Khen khi đúng (ngẫu nhiên) | Chính xác! Giỏi quá! |
| ✅ | `voice/vo-correct-2.mp3` | Giọng đọc | Khen khi đúng (ngẫu nhiên) | Tuyệt vời, đúng rồi! |
| ✅ | `voice/vo-wrong-1.mp3` | Giọng đọc | Động viên khi sai | Chưa đúng rồi, thử xem lại cách bấm nhé. |
| ✅ | `voice/vo-complete.mp3` | Giọng đọc | Hoàn thành bài | Hoàn thành bài học rồi! Mochi tự hào về em lắm. |
| ✅ | `sfx/gp-key.mp3` | Hiệu ứng | Gõ đúng một phím | Very soft short mechanical keyboard key click, clean, 0.08 seconds |
| ✅ | `sfx/gp-miss.mp3` | Hiệu ứng | Gõ sai phím | Short soft digital error blip, low pitch, not harsh, 0.15 seconds |
| ✅ | `sfx/gp-hit.mp3` | Hiệu ứng | Bắn hạ cá | Short sci-fi laser zap followed by a small underwater bubble pop, 0.5 seconds |
| ✅ | `sfx/gp-bite.mp3` | Hiệu ứng | Cá chạm vào thợ lặn | Muffled underwater chomp with a short low warning buzz, 0.5 seconds |
| ✅ | `sfx/gp-wave.mp3` | Hiệu ứng | Bắt đầu lượt, đợt cá mới | Deep sonar ping with soft echo underwater, 1 second |
| ✅ | `sfx/gp-go.mp3` | Hiệu ứng | Đếm ngược xuất phát đua xe | Three short electronic countdown beeps and a higher go beep, 2 seconds |
| ✅ | `voice/vo-gp-n01.mp3` | Giọng đọc | Gõ phím · Bài đầu Hàng nhà, câu chào của Bit | Chào em, tớ là Bit! Mình sẽ lặn xuống biển sâu và hạ cá mập bằng bàn phím. Trước tiên, đặt hai ngón trỏ lên phím F và J nhé. |
| ✅ | `voice/vo-gp-t01.mp3` | Giọng đọc | Gõ phím · Bài đầu Từng bàn tay | Lên hàng trên nào! Ngón nào với lên phím nào thì gõ xong phải về hàng nhà nha. |
| ✅ | `voice/vo-gp-p01.mp3` | Giọng đọc | Gõ phím · Bài đầu Phối hợp | Giờ hai tay cùng chơi. Gõ đều tay, mắt nhìn màn hình là sẽ nhanh thôi. |
| ✅ | `voice/vo-gp-v01.mp3` | Giọng đọc | Gõ phím · Bài đầu Telex | Gõ tiếng Việt có dấu thôi! Gõ a hai lần là thành chữ â. Học Vui tự ghép chữ cho em. |
