# Danh sách ảnh và âm thanh cần tạo

File này sinh tự động từ `src/content/assets.ts` bằng `npm run prompts`. ✅ là đã có file, ⬜ là còn thiếu.

## Cách làm

1. **Ảnh (ChatGPT):** dán prompt, chọn đúng kích thước. Ảnh nhân vật, huy hiệu, avatar cần **nền trong suốt** (nói rõ "transparent background", xuất PNG).
2. Đặt file vào `public/assets/img/` với **đúng tên** (đuôi .webp, .png hoặc .jpg đều được; .webp nhẹ nhất, đổi bằng squoosh.app).
3. **Âm thanh (ElevenLabs):** hiệu ứng dùng *Sound Effects*, lời đọc dùng *Text to Speech*. Lưu `.mp3` đúng tên vào `public/assets/sfx/` hoặc `public/assets/voice/`.
4. Chạy `npm run dev` (hoặc deploy lại) là app tự dùng file mới; file nào chưa có thì app hiện hình thay thế.

**Giữ nhân vật đồng nhất:** tạo `mochi-happy` trước, sau đó đính kèm ảnh đó vào ChatGPT khi tạo các ảnh khác có Mochi và nói "same character as the attached image".

### Phong cách chung (đã gắn sẵn vào cuối mỗi prompt)

> Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark

### Nhân vật

- Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator
- Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs

## Ảnh (48)

### ⬜ `mochi-happy.webp`
- Dùng ở: Mochi vui vẻ: lời chào, slide mở đầu
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, waving one paw and smiling, full body. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `mochi-think.webp`
- Dùng ở: Mochi suy nghĩ: slide giải thích
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, paw on chin, thinking, small question mark sparkle above head, full body. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `mochi-wow.webp`
- Dùng ở: Mochi ngạc nhiên: mẹo hay, phím mới
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, eyes wide with stars, both paws up in surprise, full body. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `mochi-cheer.webp`
- Dùng ở: Mochi cổ vũ: trả lời đúng, hoàn thành bài
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, jumping with joy, confetti around, full body. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `mochi-oops.webp`
- Dùng ở: Mochi an ủi: trả lời sai
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator, sweat drop, sheepish encouraging smile, holding a tiny eraser, full body. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `xixi.webp`
- Dùng ở: Xi Xi: thẻ môn FX580, trang giới thiệu
- Kích thước: 1024x1024 · nền trong suốt

```text
Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs, standing and giving a thumbs up, full body. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `bg-home.webp`
- Dùng ở: Nền màn hình Học (trang chủ), phía sau danh sách môn
- Kích thước: 1024x1536

```text
Dreamy morning sky over a small hillside town with a cute school building, soft clouds, floating paper planes, empty space in the center for UI, portrait. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `bg-map.webp`
- Dùng ở: Nền bản đồ bài học của môn FX580
- Kích thước: 1024x1536

```text
Top-down storybook map with a winding pastel path across meadows, a river, a small bridge, a hill with a flag at the top, very soft and low contrast, empty path, portrait. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `bg-arena.webp`
- Dùng ở: Banner đầu trang Thi đấu
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator and two friend animals (a fox and a bunny) racing with calculators on a sunny sports field, dynamic but gentle. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `bg-leaderboard.webp`
- Dùng ở: Banner đầu trang Xếp hạng
- Kích thước: 1536x1024

```text
A pastel podium with three small trophies, ribbons and stars, soft spotlight. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `subject-fx580-cover.webp`
- Dùng ở: Thẻ môn Máy tính FX580 ở trang chủ
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator sitting next to Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs on a desk with notebooks and pencils, numbers floating like bubbles. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `subject-soon.webp`
- Dùng ở: Thẻ môn sắp ra mắt
- Kích thước: 1536x1024

```text
A closed gift box with a ribbon on a cloud, small sparkles, mysterious and cute. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `empty-login.webp`
- Dùng ở: Màn hình mời đăng nhập
- Kích thước: 1024x1024 · nền trong suốt

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator holding a key and smiling at a small door. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `level-mam.webp`
- Dùng ở: Huy hiệu trình độ Hạt mầm
- Kích thước: 1024x1024 · nền trong suốt

```text
Round badge with a tiny sprout in soil, soft green and cream. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `level-choi.webp`
- Dùng ở: Huy hiệu trình độ Chồi non
- Kích thước: 1024x1024 · nền trong suốt

```text
Round badge with a young plant with three leaves, soft green. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `level-cay.webp`
- Dùng ở: Huy hiệu trình độ Cây xanh
- Kích thước: 1024x1024 · nền trong suốt

```text
Round badge with a small lush tree, soft green and sky blue. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `level-hoa.webp`
- Dùng ở: Huy hiệu trình độ Cây nở hoa
- Kích thước: 1024x1024 · nền trong suốt

```text
Round badge with a tree in full pink blossom, sparkles. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `avatar-fox.webp`
- Dùng ở: Ảnh đại diện: fox
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi fox face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `avatar-bunny.webp`
- Dùng ở: Ảnh đại diện: bunny
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi bunny face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `avatar-panda.webp`
- Dùng ở: Ảnh đại diện: panda
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi panda face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `avatar-owl.webp`
- Dùng ở: Ảnh đại diện: owl
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi owl face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `avatar-bear.webp`
- Dùng ở: Ảnh đại diện: bear
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi bear face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `avatar-penguin.webp`
- Dùng ở: Ảnh đại diện: penguin
- Kích thước: 1024x1024 · nền trong suốt

```text
Cute chibi penguin face portrait in a circle, friendly expression, light pastel background circle. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark, isolated on a fully transparent background.
```

### ⬜ `fx-l01-cover.webp`
- Dùng ở: Bìa bài 1: Làm quen với Xi Xi
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator shaking hands with Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs on a sunny desk. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l02-cover.webp`
- Dùng ở: Bìa bài 2: Thứ tự phép tính
- Kích thước: 1536x1024

```text
Cute operator symbols (+, −, ×, ÷ and parentheses) standing in a queue like children lining up, the parentheses at the front. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l03-cover.webp`
- Dùng ở: Bìa bài 3: Lũy thừa
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator riding a small rocket that leaves a trail of doubling stars. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l04-cover.webp`
- Dùng ở: Bìa bài 4: Chia có dư
- Kích thước: 1536x1024

```text
Colorful candies being shared into seven small bowls, two candies left over in the middle. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l05-cover.webp`
- Dùng ở: Bìa bài 5: Số nguyên tố
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator as a detective with a magnifying glass looking at glowing prime number gems 2, 3, 5, 7. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l06-cover.webp`
- Dùng ở: Bìa bài 6: ƯCLN, BCNN
- Kích thước: 1536x1024

```text
Gift boxes split into equal groups on one side and two blinking lighthouses on the other side. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l07-cover.webp`
- Dùng ở: Bìa bài 7: Số nguyên âm
- Kích thước: 1536x1024

```text
A cute thermometer character standing in snowy mountains, a small submarine below the sea surface in the same scene. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l08-cover.webp`
- Dùng ở: Bìa bài 8: Phân số
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator with a pizza cut into 8 slices, three slices taken. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l09-cover.webp`
- Dùng ở: Bìa bài 9: Thập phân và phần trăm
- Kích thước: 1536x1024

```text
A cozy little stationery shop with discount tags showing a percent symbol. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l10-cover.webp`
- Dùng ở: Bìa bài 10: Chu vi, diện tích
- Kích thước: 1536x1024

```text
A garden seen from above divided into rectangle, rhombus, parallelogram and trapezoid flower beds. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l01-s1.webp`
- Dùng ở: Bài 1, slide 1: Mochi giới thiệu Xi Xi
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator presenting Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs with open paws, sparkles. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l01-s3.webp`
- Dùng ở: Bài 1, slide 3: chữ vàng chữ đỏ trên phím
- Kích thước: 1536x1024

```text
Close-up of three calculator keys, each with a small yellow label and a small red label above it, glowing softly, two tiny arrows pointing to the labels. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l02-s1.webp`
- Dùng ở: Bài 2, slide 1: luật xếp hàng phép tính
- Kích thước: 1536x1024

```text
Four podium steps labelled with icons: parentheses on top, then a power symbol, then × ÷, then + −, cute characters on each step. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l02-s4.webp`
- Dùng ở: Bài 2, slide 4: mẹ đi chợ
- Kích thước: 1536x1024

```text
A mother cat and Mochi at a Vietnamese wet market stall with oranges and bundles of vegetables. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l03-s1.webp`
- Dùng ở: Bài 3, slide 1: lũy thừa nhân đôi
- Kích thước: 1536x1024

```text
A row of five boxes, each containing twice as many glowing marbles as the one before. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l04-s1.webp`
- Dùng ở: Bài 4, slide 1: chia kẹo
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator handing out candies to seven classmates sitting in a circle, two candies left. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l05-s1.webp`
- Dùng ở: Bài 5, slide 1: số nguyên tố là viên đá quý
- Kích thước: 1536x1024

```text
Glowing gemstones with numbers 2, 3, 5, 7, 11 inside, and ordinary pebbles with 4, 6, 9 beside them. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l06-s1.webp`
- Dùng ở: Bài 6, slide 1: GCD và LCM
- Kích thước: 1536x1024

```text
Two cute twin robot characters with badges, one badge shows a gift box, the other shows a clock. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l06-s4.webp`
- Dùng ở: Bài 6, slide 4: chia giỏ trái cây
- Kích thước: 1536x1024

```text
Twelve equal baskets each with oranges and tangerines, arranged neatly on a table. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l07-s1.webp`
- Dùng ở: Bài 7, slide 1: số âm quanh ta
- Kích thước: 1536x1024

```text
Split scene: snowy mountain town with a thermometer below zero on the left, a submarine underwater with a depth gauge on the right. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l08-s1.webp`
- Dùng ở: Bài 8, slide 1: bánh pizza 3/8
- Kích thước: 1536x1024

```text
A round pizza cut into 8 equal slices, 3 slices slightly pulled out, top view. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l09-s2.webp`
- Dùng ở: Bài 9, slide 2: làm tròn số
- Kích thước: 1536x1024

```text
A number line like a little road with a ball rolling to the nearest flag, gentle hills. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l09-s4.webp`
- Dùng ở: Bài 9, slide 4: mua giày giảm giá
- Kích thước: 1536x1024

```text
Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator trying on sneakers in a shop, a big sale tag nearby. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l10-s1.webp`
- Dùng ở: Bài 10, slide 1: các hình
- Kích thước: 1536x1024

```text
Five friendly shape characters: rectangle, square, rhombus, parallelogram, isosceles trapezoid, standing together. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

### ⬜ `fx-l10-s3.webp`
- Dùng ở: Bài 10, slide 3: rào sân
- Kích thước: 1536x1024

```text
A rectangular schoolyard with a small wooden fence being built around it, top-down three-quarter view. Soft anime illustration, gentle pastel palette (sky blue, peach, mint, cream), clean line art, soft cel shading, warm light, cozy and calm, child-friendly but not babyish, no text, no watermark.
```

## Âm thanh (30)

Cài đặt giọng đọc gợi ý: ElevenLabs Text to Speech, model Multilingual v2 hoặc v3, giọng nữ trẻ ấm áp (vd. chọn giọng tiếng Việt trong Voice Library), stability ~50%, style thấp, tốc độ chậm vừa. Xuất MP3 44.1kHz.

| | File | Loại | Dùng ở | Prompt / lời đọc |
|---|---|---|---|---|
| ⬜ | `sfx/tap.mp3` | Hiệu ứng | Chạm phím máy tính ảo, nút bấm | Soft short plastic button click, gentle, 0.1 seconds |
| ⬜ | `sfx/correct.mp3` | Hiệu ứng | Trả lời đúng | Cheerful bright two-note chime, soft xylophone, 0.6 seconds |
| ⬜ | `sfx/wrong.mp3` | Hiệu ứng | Trả lời sai | Gentle low wooden 'bonk', friendly, not harsh, 0.4 seconds |
| ⬜ | `sfx/complete.mp3` | Hiệu ứng | Hoàn thành bài học / luyện tập | Short magical sparkle fanfare with soft bells, 2 seconds |
| ⬜ | `sfx/levelup.mp3` | Hiệu ứng | Kết quả kiểm tra trình độ, lên cấp | Uplifting harp glissando followed by a soft chime, 2.5 seconds |
| ⬜ | `sfx/tick.mp3` | Hiệu ứng | Đếm ngược 3 giây cuối khi thi đấu | Soft clock tick, single, 0.2 seconds |
| ⬜ | `sfx/whoosh.mp3` | Hiệu ứng | Chuyển slide | Very soft paper whoosh, 0.3 seconds |
| ⬜ | `sfx/bgm-learn.mp3` | Nhạc | Nhạc nền nhẹ (tùy chọn, bật trong cài đặt) | Calm lo-fi acoustic loop for children studying, soft piano and ukulele, 80 bpm, seamless loop, 60 seconds |
| ⬜ | `voice/vo-l01-s1.mp3` | Giọng đọc | Bài 1, slide 1 | Chào em, tớ là Mochi! Đây là bạn đồng hành mới của chúng mình, máy tính Casio fx năm tám mươi V N X. Tớ gọi bạn ấy là Xi Xi. Cùng làm quen nhé! |
| ⬜ | `voice/vo-l01-s2.mp3` | Giọng đọc | Bài 1, slide 2 | Bấm ON để bật máy. Phím AC xóa hết để làm phép tính mới, còn phím DEL chỉ xóa một chữ số thôi. |
| ⬜ | `voice/vo-l01-s3.mp3` | Giọng đọc | Bài 1, slide 3 | Em có thấy chữ nhỏ màu vàng và màu đỏ trên phím không? Bấm SHIFT để dùng chữ vàng, bấm ALPHA để dùng chữ đỏ. |
| ⬜ | `voice/vo-l01-s4.mp3` | Giọng đọc | Bài 1, slide 4 | Nếu máy hiện kết quả lạ, em có thể đưa máy về cài đặt gốc. Nhưng nhớ là bộ nhớ sẽ bị xóa đó. |
| ⬜ | `voice/vo-l01-s5.mp3` | Giọng đọc | Bài 1, slide 5 | Giờ thử phép tính đầu tiên nhé. Em chạm vào các phím theo đúng thứ tự, rồi bấm bằng. |
| ⬜ | `voice/vo-l02-s1.mp3` | Giọng đọc | Bài 2, slide 1 | Các phép tính cũng phải xếp hàng đấy. Trong ngoặc trước, rồi lũy thừa, rồi nhân chia, cuối cùng mới đến cộng trừ. |
| ⬜ | `voice/vo-l02-s4.mp3` | Giọng đọc | Bài 2, slide 4 | Đi chợ cùng mẹ nào! Em chỉ cần viết thành một biểu thức, rồi gõ liền một lần vào máy. |
| ⬜ | `voice/vo-l03-s1.mp3` | Giọng đọc | Bài 3, slide 1 | Lũy thừa là nhân một số với chính nó nhiều lần. Hai mũ năm là hai nhân hai nhân hai nhân hai nhân hai, bằng ba mươi hai. |
| ⬜ | `voice/vo-l04-s1.mp3` | Giọng đọc | Bài 4, slide 1 | Một trăm cái kẹo chia cho bảy bạn. Mỗi bạn được mười bốn cái, còn dư hai cái. Xi Xi tính việc này chỉ trong một lần bấm. |
| ⬜ | `voice/vo-l05-s1.mp3` | Giọng đọc | Bài 5, slide 1 | Số nguyên tố giống như viên đá quý, chỉ chia hết cho một và chính nó. Hôm nay mình làm thám tử đi tìm chúng nhé. |
| ⬜ | `voice/vo-l06-s1.mp3` | Giọng đọc | Bài 6, slide 1 | Gặp hai người bạn mới: GCD là ước chung lớn nhất, LCM là bội chung nhỏ nhất. Họ sống trên phím nhân và phím chia. |
| ⬜ | `voice/vo-l06-s4.mp3` | Giọng đọc | Bài 6, slide 4 | Chia đều, nhiều nhất thì nghĩ đến ước chung lớn nhất. Lặp lại, gặp nhau lần tới thì nghĩ đến bội chung nhỏ nhất. |
| ⬜ | `voice/vo-l07-s1.mp3` | Giọng đọc | Bài 7, slide 1 | Ở Sa Pa có khi lạnh dưới không độ. Những con số nhỏ hơn không gọi là số âm. Xi Xi có phím riêng cho dấu âm đó. |
| ⬜ | `voice/vo-l08-s1.mp3` | Giọng đọc | Bài 8, slide 1 | Chiếc bánh cắt thành tám miếng, em ăn ba miếng, vậy em đã ăn ba phần tám cái bánh. |
| ⬜ | `voice/vo-l09-s1.mp3` | Giọng đọc | Bài 9, slide 1 | Mình viết ba phẩy năm, nhưng trên máy em bấm dấu chấm nhé. Hai cách viết là một số thôi. |
| ⬜ | `voice/vo-l09-s4.mp3` | Giọng đọc | Bài 9, slide 4 | Đôi giày đang giảm giá hai mươi phần trăm. Cùng tính xem còn phải trả bao nhiêu tiền nào. |
| ⬜ | `voice/vo-l10-s1.mp3` | Giọng đọc | Bài 10, slide 1 | Đây là bảng công thức chu vi và diện tích. Em không cần học thuộc ngay, cứ xem lại mỗi khi cần nhé. |
| ⬜ | `voice/vo-l10-s3.mp3` | Giọng đọc | Bài 10, slide 3 | Rào xung quanh là chu vi, còn lát nền là diện tích. Đọc kỹ đề trước khi bấm máy nhé. |
| ⬜ | `voice/vo-correct-1.mp3` | Giọng đọc | Khen khi đúng (ngẫu nhiên) | Chính xác! Giỏi quá! |
| ⬜ | `voice/vo-correct-2.mp3` | Giọng đọc | Khen khi đúng (ngẫu nhiên) | Tuyệt vời, đúng rồi! |
| ⬜ | `voice/vo-wrong-1.mp3` | Giọng đọc | Động viên khi sai | Chưa đúng rồi, thử xem lại cách bấm nhé. |
| ⬜ | `voice/vo-complete.mp3` | Giọng đọc | Hoàn thành bài | Hoàn thành bài học rồi! Mochi tự hào về em lắm. |
