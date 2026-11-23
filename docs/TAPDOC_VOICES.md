# Giọng đọc mẫu môn Tập đọc

Sinh tự động bằng `npm run prompts`. 1227 file, còn thiếu 0. Chưa có file thì app dùng giọng tiếng Việt có sẵn của máy (iPad: giọng Linh).

## Cách làm

- ElevenLabs Text to Speech, model **Multilingual v2** (hoặc v3), **một giọng nữ miền Bắc** trong trẻo, chậm rãi, giống cô giáo lớp 1. Dùng **cùng một giọng** cho mọi file.
- Stability khoảng 60%, Style 0, Speed 0.85. Mỗi dòng là một file riêng, lưu `.mp3` đúng tên vào `public/assets/voice/`.
- Âm và vần đứng một mình ("bờ", "an", "oăng") máy hay đọc sai: nghe lại từng file, sai thì thử thêm dấu chấm sau chữ ("bờ.") hoặc đọc lại vài lần chọn bản đúng.
- Tên file theo kiểu gõ Telex: `bàn` → `tv-banf.mp3`, `cái bàn` → `tv-cais_banf.mp3`.
- Ưu tiên tạo trước: nhóm *Âm đầu*, *Tên dấu*, *Âm, vần*, *Từ khóa*; câu dài để sau.


### Lời dẫn câu hỏi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nghe_vaf_chonj_chuwx_ddungs.mp3` | Nghe và chọn chữ đúng. |
| ✅ | `tv-nghe_vaf_chonj_vaanf_ddungs.mp3` | Nghe và chọn vần đúng. |
| ✅ | `tv-nghe_vaf_chonj_tieengs_ddungs.mp3` | Nghe và chọn tiếng đúng. |
| ✅ | `tv-nghe_vaf_chonj_tuwf_ddungs.mp3` | Nghe và chọn từ đúng. |
| ✅ | `tv-nghe_vaf_chonj_caau_ddungs.mp3` | Nghe và chọn câu đúng. |
| ✅ | `tv-tieengs_naof_cos.mp3` | Tiếng nào có |
| ✅ | `tv-tieengs_naof_cos_vaanf.mp3` | Tiếng nào có vần |
| ✅ | `tv-gheps_laij_thanhf_tieengs_naof.mp3` | Ghép lại thành tiếng nào? |
| ✅ | `tv-tieengs_nayf_cos_daaus_gif.mp3` | Tiếng này có dấu gì? |
| ✅ | `tv-em_ddocj_to_tieengs_nayf_nhes.mp3` | Em đọc to tiếng này nhé. |
| ✅ | `tv-em_ddocj_to_nhes.mp3` | Em đọc to nhé. |
| ✅ | `tv-chonj_tieengs_conf_thieeus_trong_caau.mp3` | Chọn tiếng còn thiếu trong câu. |
| ✅ | `tv-minhf_thuwr_nhanh_nhes.mp3` | Mình thử nhanh nhé! |

### Mochi khen, nhắc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddocj_ddungs_rooif_gioir_quas.mp3` | Đọc đúng rồi, giỏi quá! |
| ✅ | `tv-gaanf_ddungs_rooif_chus_ys_daaus_thanh_nhes.mp3` | Gần đúng rồi, chú ý dấu thanh nhé! |
| ✅ | `tv-minhf_nghe_maaux_rooif_ddocj_laij_nha.mp3` | Mình nghe mẫu rồi đọc lại nha! |
| ✅ | `tv-em_nghe_laij_giongj_minhf_ddocj_ddungs_chuwa_naof.mp3` | Em nghe lại giọng mình, đọc đúng chưa nào? |

### Âm đầu (đánh vần)

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bowf.mp3` | bờ |
| ✅ | `tv-cowf.mp3` | cờ |
| ✅ | `tv-dowf.mp3` | dờ |
| ✅ | `tv-ddowf.mp3` | đờ |
| ✅ | `tv-gowf.mp3` | gờ |
| ✅ | `tv-howf.mp3` | hờ |
| ✅ | `tv-ca.mp3` | ca |
| ✅ | `tv-khowf.mp3` | khờ |
| ✅ | `tv-lowf.mp3` | lờ |
| ✅ | `tv-mowf.mp3` | mờ |
| ✅ | `tv-nowf.mp3` | nờ |
| ✅ | `tv-ngowf.mp3` | ngờ |
| ✅ | `tv-nhowf.mp3` | nhờ |
| ✅ | `tv-powf.mp3` | pờ |
| ✅ | `tv-phowf.mp3` | phờ |
| ✅ | `tv-quowf.mp3` | quờ |
| ✅ | `tv-rowf.mp3` | rờ |
| ✅ | `tv-sowf.mp3` | sờ |
| ✅ | `tv-towf.mp3` | tờ |
| ✅ | `tv-thowf.mp3` | thờ |
| ✅ | `tv-trowf.mp3` | trờ |
| ✅ | `tv-vowf.mp3` | vờ |
| ✅ | `tv-xowf.mp3` | xờ |
| ✅ | `tv-chowf.mp3` | chờ |
| ✅ | `tv-di.mp3` | di |

### Tên dấu (đánh vần)

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-huyeenf.mp3` | huyền |
| ✅ | `tv-sawcs.mp3` | sắc |
| ✅ | `tv-hoir.mp3` | hỏi |
| ✅ | `tv-ngax.mp3` | ngã |
| ✅ | `tv-nawngj.mp3` | nặng |

### Sáu thanh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ba.mp3` | ba |
| ✅ | `tv-baf.mp3` | bà |
| ✅ | `tv-bas.mp3` | bá |
| ✅ | `tv-bar.mp3` | bả |
| ✅ | `tv-bax.mp3` | bã |
| ✅ | `tv-baj.mp3` | bạ |

### Âm, vần · a, o, ô

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-a.mp3` | a |

### Tiếng · a, o, ô

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-af.mp3` | à |
| ✅ | `tv-as.mp3` | á |

### Âm, vần · a, o, ô

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-o.mp3` | o |

### Tiếng · a, o, ô

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-of.mp3` | ò |
| ✅ | `tv-os.mp3` | ó |

### Từ khóa · a, o, ô

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-o_tronf.mp3` | o tròn |

### Âm, vần · a, o, ô

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oo.mp3` | ô |

### Tiếng · a, o, ô

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oof.mp3` | ồ |
| ✅ | `tv-oos.mp3` | ố |

### Từ khóa · a, o, ô

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oo_cos_mux.mp3` | ô có mũ |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chaof_em_tows_laf_mochi_hoom-503kv.mp3` | Chào em! Tớ là Mochi. Hôm nay mình gặp ba bạn chữ đầu tiên. Nghe tớ đọc rồi đọc theo nhé! |

### Âm, vần · ơ, e, ê

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ow.mp3` | ơ |

### Tiếng · ơ, e, ê

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-owf.mp3` | ờ |
| ✅ | `tv-ows.mp3` | ớ |

### Từ khóa · ơ, e, ê

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ow_cos_raau.mp3` | ơ có râu |

### Âm, vần · ơ, e, ê

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-e.mp3` | e |

### Tiếng · ơ, e, ê

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ef.mp3` | è |
| ✅ | `tv-es.mp3` | é |

### Âm, vần · ơ, e, ê

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ee.mp3` | ê |

### Tiếng · ơ, e, ê

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eef.mp3` | ề |
| ✅ | `tv-ees.mp3` | ế |

### Từ khóa · ơ, e, ê

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ee_cos_mux.mp3` | ê có mũ |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chuwx_ow_cos_mootj_cais_raau-23sfx.mp3` | Chữ ơ có một cái râu nhỏ, chữ ê đội mũ giống ô. Mình cùng đọc nào! |

### Âm, vần · i, u, ư

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-i.mp3` | i |

### Tiếng · i, u, ư

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-if.mp3` | ì |
| ✅ | `tv-is.mp3` | í |

### Từ khóa · i, u, ư

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-i_cos_chaams.mp3` | i có chấm |

### Âm, vần · i, u, ư

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-u.mp3` | u |

### Tiếng · i, u, ư

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uf.mp3` | ù |
| ✅ | `tv-us.mp3` | ú |

### Âm, vần · i, u, ư

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uw.mp3` | ư |

### Tiếng · i, u, ư

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwf.mp3` | ừ |
| ✅ | `tv-uws.mp3` | ứ |

### Từ khóa · i, u, ư

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uw_cos_raau.mp3` | ư có râu |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chuwx_i_cos_mootj_cais_chaams-1rbtc.mp3` | Chữ i có một cái chấm trên đầu. Chữ ư là chữ u có thêm râu. |

### Đánh vần · ă, â, y

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-awn.mp3` | ăn |

### Tiếng · ă, â, y

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-awts.mp3` | ắt |
| ✅ | `tv-awmr.mp3` | ẳm |

### Từ khóa · ă, â, y

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aw_trawng.mp3` | ă trăng |

### Đánh vần · ă, â, y

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aam.mp3` | âm |
| ✅ | `tv-aams.mp3` | ấm |

### Tiếng · ă, â, y

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aaps.mp3` | ấp |
| ✅ | `tv-aan.mp3` | ân |

### Từ khóa · ă, â, y

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aa_mux.mp3` | â mũ |

### Đánh vần · ă, â, y

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-y.mp3` | y |

### Tiếng · ă, â, y

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ys.mp3` | ý |
| ✅ | `tv-yr.mp3` | ỷ |

### Từ khóa · ă, â, y

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-i_daif.mp3` | i dài |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aw_ddooij_cais_mux_hinhf_trawng-1n74u.mp3` | ă đội cái mũ hình trăng khuyết, â đội mũ nhọn. Còn y gọi là i dài, đọc giống i. |

### Tiếng · b, huyền, sắc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes.mp3` | bé |
| ✅ | `tv-bee.mp3` | bê |
| ✅ | `tv-bof.mp3` | bò |
| ✅ | `tv-boos.mp3` | bố |

### Câu ứng dụng · b, huyền, sắc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_bees_bee.mp3` | bé bế bê |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddaay_laf_chuwx_b_ddocj_laf-n64z0.mp3` | Đây là chữ b, đọc là bờ. Ghép bờ với a thành ba. Thêm dấu huyền thành bà, dấu sắc thành bá! |

### Đánh vần · Hỏi, ngã, nặng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-beer.mp3` | bể |

### Tiếng · Hỏi, ngã, nặng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ber.mp3` | bẻ |
| ✅ | `tv-bex.mp3` | bẽ |
| ✅ | `tv-box.mp3` | bõ |
| ✅ | `tv-bij.mp3` | bị |

### Từ khóa · Hỏi, ngã, nặng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-beer_cas.mp3` | bể cá |

### Câu ứng dụng · Hỏi, ngã, nặng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-baf_ber_bis_bes_bee_beer.mp3` | bà bẻ bí, bé bê bể |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-theem_ba_daaus_nuwax_daaus_hoir-1l8dl.mp3` | Thêm ba dấu nữa: dấu hỏi như cái móc câu, dấu ngã như làn sóng, dấu nặng là một chấm dưới chân. |

### Đánh vần · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cas.mp3` | cá |

### Tiếng · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cof.mp3` | cò |
| ✅ | `tv-cor.mp3` | cỏ |
| ✅ | `tv-coo.mp3` | cô |

### Từ khóa · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_cas.mp3` | con cá |

### Đánh vần · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-dee.mp3` | dê |

### Tiếng · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-da.mp3` | da |
| ✅ | `tv-dif.mp3` | dì |
| ✅ | `tv-dees.mp3` | dế |

### Từ khóa · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_dee.mp3` | con dê |

### Đánh vần · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-dda.mp3` | đa |
| ✅ | `tv-ddas.mp3` | đá |

### Tiếng · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddof.mp3` | đò |
| ✅ | `tv-ddi.mp3` | đi |
| ✅ | `tv-ddoox.mp3` | đỗ |

### Từ khóa · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-honf_ddas.mp3` | hòn đá |

### Câu ứng dụng · c, d, đ

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_ddi_ddof_coo_bees_bes.mp3` | bé đi đò, cô bế bé |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ba_banj_chuwx_mowis_c_ddocj-hbpia.mp3` | Ba bạn chữ mới: c đọc là cờ, d đọc là dờ, đ có thêm gạch ngang đọc là đờ. |

### Đánh vần · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoo.mp3` | hô |
| ✅ | `tv-hoor.mp3` | hổ |

### Tiếng · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hef.mp3` | hè |
| ✅ | `tv-hoof.mp3` | hồ |
| ✅ | `tv-haf.mp3` | hà |

### Từ khóa · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_hoor.mp3` | con hổ |

### Đánh vần · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-la.mp3` | la |
| ✅ | `tv-las.mp3` | lá |

### Tiếng · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-lee.mp3` | lê |
| ✅ | `tv-loj.mp3` | lọ |
| ✅ | `tv-lof.mp3` | lò |

### Từ khóa · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-las_cowf.mp3` | lá cờ |

### Đánh vần · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-me.mp3` | me |
| ✅ | `tv-mej.mp3` | mẹ |

### Tiếng · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mux.mp3` | mũ |
| ✅ | `tv-mow.mp3` | mơ |

### Từ khóa · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mej_bes.mp3` | mẹ bé |

### Câu ứng dụng · h, l, m

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mej_bees_bes_ddi_hoof.mp3` | mẹ bế bé đi hồ |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-h_ddocj_laf_howf_l_ddocj-3vve4.mp3` | h đọc là hờ, l đọc là lờ, m đọc là mờ. Miệng ngậm lại khi đọc mờ nhé! |

### Đánh vần · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-now.mp3` | nơ |

### Tiếng · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-no.mp3` | no |
| ✅ | `tv-nos.mp3` | nó |
| ✅ | `tv-na.mp3` | na |

### Từ khóa · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_now.mp3` | cái nơ |

### Đánh vần · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ke.mp3` | ke |
| ✅ | `tv-ker.mp3` | kẻ |

### Tiếng · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-kee.mp3` | kê |
| ✅ | `tv-kif.mp3` | kì |
| ✅ | `tv-keer.mp3` | kể |

### Từ khóa · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ker_vowr.mp3` | kẻ vở |

### Đánh vần · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ga.mp3` | ga |
| ✅ | `tv-gaf.mp3` | gà |

### Tiếng · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-goox.mp3` | gỗ |
| ✅ | `tv-gox.mp3` | gõ |

### Từ khóa · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_gaf.mp3` | con gà |

### Câu ứng dụng · n, k, g

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-gaf_mej_keer_cho_gaf_con.mp3` | gà mẹ kể cho gà con |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-n_ddocj_laf_nowf_k_ddocj-1rwit.mp3` | n đọc là nờ, k đọc là ca, g đọc là gờ. Chữ k có một luật nhỏ, xem nhé! |

### Đánh vần · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-roo.mp3` | rô |
| ✅ | `tv-roor.mp3` | rổ |

### Tiếng · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ras.mp3` | rá |
| ✅ | `tv-reex.mp3` | rễ |
| ✅ | `tv-rif.mp3` | rì |

### Từ khóa · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_roor.mp3` | cái rổ |

### Đánh vần · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-so.mp3` | so |
| ✅ | `tv-sof.mp3` | sò |

### Tiếng · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ser.mp3` | sẻ |
| ✅ | `tv-soos.mp3` | số |
| ✅ | `tv-suw.mp3` | sư |

### Từ khóa · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_sof.mp3` | con sò |

### Đánh vần · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-too.mp3` | tô |

### Tiếng · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-toor.mp3` | tổ |
| ✅ | `tv-tur.mp3` | tủ |
| ✅ | `tv-tow.mp3` | tơ |

### Từ khóa · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-too_mif.mp3` | tô mì |

### Câu ứng dụng · r, s, t

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-toor_ser_owr_bowf_ddee.mp3` | tổ sẻ ở bờ đê |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-r_ddocj_laf_rowf_s_ddocj-o7y2w.mp3` | r đọc là rờ, s đọc là sờ, t đọc là tờ. Cùng đọc to nào! |

### Đánh vần · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vow.mp3` | vơ |
| ✅ | `tv-vowr.mp3` | vở |

### Tiếng · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vex.mp3` | vẽ |
| ✅ | `tv-ve.mp3` | ve |
| ✅ | `tv-vos.mp3` | vó |

### Từ khóa · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quyeenr_vowr.mp3` | quyển vở |

### Đánh vần · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xe.mp3` | xe |

### Tiếng · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xoo.mp3` | xô |
| ✅ | `tv-xa.mp3` | xa |
| ✅ | `tv-xuf.mp3` | xù |

### Từ khóa · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xe_ddor.mp3` | xe đỏ |

### Đánh vần · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-pa.mp3` | pa |

### Tiếng · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-pis.mp3` | pí |
| ✅ | `tv-poo.mp3` | pô |

### Từ khóa · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-pa_pa.mp3` | pa pa |

### Câu ứng dụng · v, x, p

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_vex_xe_owr_vowr.mp3` | bé vẽ xe ở vở |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-v_ddocj_laf_vowf_x_ddocj-wn5nu.mp3` | v đọc là vờ, x đọc là xờ, p đọc là pờ. Chữ p hay đi với h, mình sẽ gặp lại sau. |

### Đánh vần · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cho.mp3` | cho |
| ✅ | `tv-chos.mp3` | chó |

### Tiếng · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chef.mp3` | chè |
| ✅ | `tv-chus.mp3` | chú |
| ✅ | `tv-chij.mp3` | chị |

### Từ khóa · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_chos.mp3` | con chó |

### Đánh vần · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nho.mp3` | nho |

### Tiếng · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhaf.mp3` | nhà |
| ✅ | `tv-nhoor.mp3` | nhổ |
| ✅ | `tv-nhej.mp3` | nhẹ |

### Từ khóa · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chumf_nho.mp3` | chùm nho |

### Đánh vần · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tho.mp3` | tho |
| ✅ | `tv-thor.mp3` | thỏ |

### Tiếng · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thar.mp3` | thả |
| ✅ | `tv-thif.mp3` | thì |
| ✅ | `tv-thow.mp3` | thơ |

### Từ khóa · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chus_thor.mp3` | chú thỏ |

### Câu ứng dụng · ch, nh, th

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhaf_thor_cos_chus_chos_nhor.mp3` | nhà thỏ có chú chó nhỏ |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hai_chuwx_dduwngs_canhj_nhau_thanhf-hfb69.mp3` | Hai chữ đứng cạnh nhau thành một âm mới. c với h thành chờ, n với h thành nhờ, t với h thành thờ. |

### Đánh vần · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khee.mp3` | khê |
| ✅ | `tv-khees.mp3` | khế |

### Tiếng · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khos.mp3` | khó |
| ✅ | `tv-khir.mp3` | khỉ |
| ✅ | `tv-kho.mp3` | kho |

### Từ khóa · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_khees.mp3` | quả khế |

### Đánh vần · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-phow.mp3` | phơ |
| ✅ | `tv-phowr.mp3` | phở |

### Tiếng · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-phoos.mp3` | phố |
| ✅ | `tv-phaf.mp3` | phà |
| ✅ | `tv-phus.mp3` | phú |

### Từ khóa · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bats_phowr.mp3` | bát phở |

### Đánh vần · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tre.mp3` | tre |

### Tiếng · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-trer.mp3` | trẻ |
| ✅ | `tv-traf.mp3` | trà |
| ✅ | `tv-tree.mp3` | trê |

### Từ khóa · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caay_tre.mp3` | cây tre |

### Câu ứng dụng · kh, ph, tr

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-phoos_cos_phowr_nhaf_cos_tre.mp3` | phố có phở, nhà có tre |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-theem_ba_chuwx_gheps_khowf_phowf-np92m.mp3` | Thêm ba chữ ghép: khờ, phờ, trờ. Đọc trờ thì cong lưỡi lên một chút. |

### Đánh vần · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngoo.mp3` | ngô |

### Tiếng · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngur.mp3` | ngủ |
| ✅ | `tv-ngaf.mp3` | ngà |
| ✅ | `tv-ngox.mp3` | ngõ |

### Từ khóa · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bawps_ngoo.mp3` | bắp ngô |

### Đánh vần · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nghe.mp3` | nghe |
| ✅ | `tv-nghes.mp3` | nghé |

### Tiếng · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngheef.mp3` | nghề |
| ✅ | `tv-nghir.mp3` | nghỉ |

### Từ khóa · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chus_nghes.mp3` | chú nghé |

### Đánh vần · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ghee.mp3` | ghê |
| ✅ | `tv-ghees.mp3` | ghế |

### Tiếng · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ghi.mp3` | ghi |
| ✅ | `tv-ghej.mp3` | ghẹ |
| ✅ | `tv-ghes.mp3` | ghé |

### Từ khóa · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_ghees.mp3` | cái ghế |

### Câu ứng dụng · ng, ngh, gh

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nghes_nghe_bes_ghes_nhaf.mp3` | nghé nghe bé ghé nhà |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hai_banj_ng_vaf_ngh_cungf-1l591.mp3` | Hai bạn ng và ngh cùng đọc là ngờ, gh đọc là gờ. Có một luật rất hay về chúng! |

### Đánh vần · gi, qu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-gio.mp3` | gio |
| ✅ | `tv-gios.mp3` | gió |

### Tiếng · gi, qu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-gias.mp3` | giá |
| ✅ | `tv-gior.mp3` | giỏ |
| ✅ | `tv-giof.mp3` | giò |

### Từ khóa · gi, qu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cown_gios.mp3` | cơn gió |

### Đánh vần · gi, qu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-qua.mp3` | qua |
| ✅ | `tv-quar.mp3` | quả |

### Tiếng · gi, qu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quee.mp3` | quê |
| ✅ | `tv-quaf.mp3` | quà |
| ✅ | `tv-quaj.mp3` | quạ |

### Từ khóa · gi, qu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_lee.mp3` | quả lê |

### Câu ứng dụng · gi, qu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quee_baf_cos_gios_cos_quar.mp3` | quê bà có gió, có quả |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-gi_ddocj_laf_di_qu_ddocj-pw316.mp3` | gi đọc là di, qu đọc là quờ. Chữ q lúc nào cũng đi cùng chữ u. |

### Âm, vần · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-an.mp3` | an |

### Đánh vần · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ban.mp3` | ban |
| ✅ | `tv-banf.mp3` | bàn |

### Tiếng · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-lan.mp3` | lan |
| ✅ | `tv-nhanx.mp3` | nhãn |
| ✅ | `tv-ddanf.mp3` | đàn |

### Từ khóa · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_banf.mp3` | cái bàn |

### Đánh vần · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khawn.mp3` | khăn |

### Tiếng · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chawn.mp3` | chăn |
| ✅ | `tv-rawn.mp3` | răn |
| ✅ | `tv-lawn.mp3` | lăn |

### Từ khóa · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khawn_len.mp3` | khăn len |

### Đánh vần · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caan.mp3` | cân |

### Tiếng · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-saan.mp3` | sân |
| ✅ | `tv-chaan.mp3` | chân |
| ✅ | `tv-daan.mp3` | dân |

### Từ khóa · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_caan.mp3` | cái cân |

### Câu ứng dụng · an, ăn, ân

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_quangf_khawn_ra_saan.mp3` | bé quàng khăn ra sân |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_mowis_ddaay_a_gheps_vowis-ylf3e.mp3` | Vần mới đây! a ghép với nờ thành an. Ba vần này chỉ khác nhau cái mũ thôi. |

### Âm, vần · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-am.mp3` | am |

### Đánh vần · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cam.mp3` | cam |

### Tiếng · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-lamf.mp3` | làm |
| ✅ | `tv-nam.mp3` | nam |
| ✅ | `tv-tams.mp3` | tám |

### Từ khóa · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_cam.mp3` | quả cam |

### Âm, vần · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-awm.mp3` | ăm |

### Đánh vần · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tawm.mp3` | tăm |
| ✅ | `tv-tawmf.mp3` | tằm |

### Tiếng · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chawm.mp3` | chăm |
| ✅ | `tv-nawm.mp3` | năm |
| ✅ | `tv-tawms.mp3` | tắm |

### Từ khóa · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_tawmf.mp3` | con tằm |

### Đánh vần · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-naam.mp3` | nâm |
| ✅ | `tv-naams.mp3` | nấm |

### Tiếng · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-maamf.mp3` | mầm |
| ✅ | `tv-saams.mp3` | sấm |
| ✅ | `tv-taams.mp3` | tấm |

### Từ khóa · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caay_naams.mp3` | cây nấm |

### Câu ứng dụng · am, ăm, âm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_chawm_lamf_bes_tawms_cho_gaf.mp3` | bé chăm làm, bé tắm cho gà |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_am_awm_aam_ddeeuf_keets-znfcd.mp3` | Vần am, ăm, âm đều kết thúc bằng mờ, khi đọc xong thì ngậm môi lại. |

### Âm, vần · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ai.mp3` | ai |

### Đánh vần · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nai.mp3` | nai |

### Tiếng · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hai.mp3` | hai |
| ✅ | `tv-tai.mp3` | tai |
| ✅ | `tv-mais.mp3` | mái |

### Từ khóa · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_nai.mp3` | con nai |

### Âm, vần · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ay.mp3` | ay |

### Đánh vần · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bay.mp3` | bay |

### Tiếng · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tay.mp3` | tay |
| ✅ | `tv-mays.mp3` | máy |
| ✅ | `tv-chayj.mp3` | chạy |

### Từ khóa · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mays_bay.mp3` | máy bay |

### Âm, vần · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aay.mp3` | ây |

### Đánh vần · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caay.mp3` | cây |

### Tiếng · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-maay.mp3` | mây |
| ✅ | `tv-daay.mp3` | dây |
| ✅ | `tv-thaays.mp3` | thấy |

### Từ khóa · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caay_xanh.mp3` | cây xanh |

### Câu ứng dụng · ai, ay, ây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mays_bay_bay_qua_maay.mp3` | máy bay bay qua mây |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-a_gheps_vowis_i_thanhf_ai-hxgkw.mp3` | a ghép với i thành ai, a ghép với y thành ay. Nghe xem có gì khác nhau nhé! |

### Âm, vần · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ao.mp3` | ao |

### Đánh vần · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-sao.mp3` | sao |

### Tiếng · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cao.mp3` | cao |
| ✅ | `tv-taos.mp3` | táo |
| ✅ | `tv-chaof.mp3` | chào |

### Từ khóa · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngooi_sao.mp3` | ngôi sao |

### Âm, vần · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-au.mp3` | au |

### Đánh vần · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-rau.mp3` | rau |

### Tiếng · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cau.mp3` | cau |
| ✅ | `tv-sau.mp3` | sau |
| ✅ | `tv-mauf.mp3` | màu |

### Từ khóa · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-rau_cair.mp3` | rau cải |

### Âm, vần · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aau.mp3` | âu |

### Đánh vần · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-gaau.mp3` | gâu |
| ✅ | `tv-gaaus.mp3` | gấu |

### Tiếng · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caau.mp3` | câu |
| ✅ | `tv-saau.mp3` | sâu |
| ✅ | `tv-ddaauj.mp3` | đậu |

### Từ khóa · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chus_gaaus.mp3` | chú gấu |

### Câu ứng dụng · ao, au, âu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-gaaus_con_hais_taos_nhoor_rau.mp3` | gấu con hái táo, nhổ rau |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ba_vaanf_tronf_mooi_ao_au-vzq7j.mp3` | Ba vần tròn môi: ao, au, âu. Đọc xong môi chu ra như thổi nến. |

### Âm, vần · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-at.mp3` | at |

### Đánh vần · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hat.mp3` | hat |
| ✅ | `tv-hats.mp3` | hát |

### Tiếng · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bats.mp3` | bát |
| ✅ | `tv-mats.mp3` | mát |
| ✅ | `tv-cats.mp3` | cát |

### Từ khóa · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ca_hats.mp3` | ca hát |

### Âm, vần · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-awt.mp3` | ăt |

### Đánh vần · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mawt.mp3` | măt |
| ✅ | `tv-mawts.mp3` | mắt |

### Tiếng · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bawts.mp3` | bắt |
| ✅ | `tv-cawts.mp3` | cắt |
| ✅ | `tv-mawtj.mp3` | mặt |

### Từ khóa · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddooi_mawts.mp3` | đôi mắt |

### Âm, vần · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aat.mp3` | ât |

### Đánh vần · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-maat.mp3` | mât |
| ✅ | `tv-maatj.mp3` | mật |

### Tiếng · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddaats.mp3` | đất |
| ✅ | `tv-nhaats.mp3` | nhất |
| ✅ | `tv-vaatj.mp3` | vật |

### Từ khóa · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-maatj_ong.mp3` | mật ong |

### Câu ứng dụng · at, ăt, ât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_hats_mawts_bes_sangs.mp3` | bé hát, mắt bé sáng |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_at_awt_aat_ddocj_ngawns-1nr0m.mp3` | Vần at, ăt, ât đọc ngắn và dứt khoát, cuối vần là tờ. |

### Âm, vần · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ap.mp3` | ap |

### Đánh vần · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thap.mp3` | thap |
| ✅ | `tv-thaps.mp3` | tháp |

### Tiếng · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddapj.mp3` | đạp |
| ✅ | `tv-saps.mp3` | sáp |
| ✅ | `tv-napj.mp3` | nạp |

### Từ khóa · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngonj_thaps.mp3` | ngọn tháp |

### Âm, vần · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-awp.mp3` | ăp |

### Đánh vần · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cawp.mp3` | căp |
| ✅ | `tv-cawpj.mp3` | cặp |

### Tiếng · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-gawpj.mp3` | gặp |
| ✅ | `tv-sawps.mp3` | sắp |
| ✅ | `tv-bawps.mp3` | bắp |

### Từ khóa · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_cawpj.mp3` | cái cặp |

### Âm, vần · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aap.mp3` | âp |

### Đánh vần · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-taap.mp3` | tâp |
| ✅ | `tv-taapj.mp3` | tập |

### Tiếng · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-naaps.mp3` | nấp |
| ✅ | `tv-caaps.mp3` | cấp |
| ✅ | `tv-laapj.mp3` | lập |

### Từ khóa · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quyeenr_taapj.mp3` | quyển tập |

### Câu ứng dụng · ap, ăp, âp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_ddeo_cawpj_ddi_xe_ddapj.mp3` | bé đeo cặp đi xe đạp |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_cuoois_powf_thif_ddocj_xong-buzsa.mp3` | Vần cuối pờ thì đọc xong môi khép lại thật nhanh. |

### Âm, vần · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ac.mp3` | ac |

### Đánh vần · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhac.mp3` | nhac |
| ✅ | `tv-nhacj.mp3` | nhạc |

### Tiếng · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bacs.mp3` | bác |
| ✅ | `tv-cacs.mp3` | các |
| ✅ | `tv-lacj.mp3` | lạc |

### Từ khóa · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-banr_nhacj.mp3` | bản nhạc |

### Âm, vần · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-awc.mp3` | ăc |

### Đánh vần · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mawc.mp3` | măc |
| ✅ | `tv-mawcj.mp3` | mặc |

### Tiếng · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-lawcs.mp3` | lắc |
| ✅ | `tv-chawcs.mp3` | chắc |

### Từ khóa · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mawcj_aos.mp3` | mặc áo |

### Âm, vần · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aac.mp3` | âc |

### Đánh vần · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-gaac.mp3` | gâc |
| ✅ | `tv-gaacs.mp3` | gấc |

### Tiếng · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-baacj.mp3` | bậc |
| ✅ | `tv-nhaacs.mp3` | nhấc |
| ✅ | `tv-giaacs.mp3` | giấc |

### Từ khóa · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_gaacs.mp3` | quả gấc |

### Câu ứng dụng · ac, ăc, âc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bacs_mawcj_aos_nghe_nhacj.mp3` | bác mặc áo, nghe nhạc |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_cuoois_cowf_ac_awc_aac-b8wjd.mp3` | Vần cuối cờ: ac, ăc, âc. Đọc xong cuống lưỡi chạm lên một chút. |

### Âm, vần · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ang.mp3` | ang |

### Đánh vần · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thang.mp3` | thang |

### Tiếng · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-langf.mp3` | làng |
| ✅ | `tv-vangf.mp3` | vàng |
| ✅ | `tv-sangs.mp3` | sáng |

### Từ khóa · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_thang.mp3` | cái thang |

### Âm, vần · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-awng.mp3` | ăng |

### Đánh vần · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mawng.mp3` | măng |

### Tiếng · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-trawng.mp3` | trăng |
| ✅ | `tv-nawngs.mp3` | nắng |
| ✅ | `tv-rawng.mp3` | răng |

### Từ khóa · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mawng_tre.mp3` | măng tre |

### Âm, vần · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-aang.mp3` | âng |

### Đánh vần · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-taang.mp3` | tâng |
| ✅ | `tv-taangf.mp3` | tầng |

### Tiếng · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaang.mp3` | vâng |
| ✅ | `tv-naang.mp3` | nâng |

### Từ khóa · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhaf_taangf.mp3` | nhà tầng |

### Câu ứng dụng · ang, ăng, âng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-trawng_sangs_car_langf.mp3` | trăng sáng cả làng |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_cuoois_ngowf_ang_awng_aang-w7asb.mp3` | Vần cuối ngờ: ang, ăng, âng. Âm vang lên ở mũi, thử bịt mũi xem! |

### Âm, vần · anh, ach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-anh.mp3` | anh |

### Đánh vần · anh, ach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chanh.mp3` | chanh |

### Tiếng · anh, ach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xanh.mp3` | xanh |
| ✅ | `tv-banhs.mp3` | bánh |
| ✅ | `tv-nhanh.mp3` | nhanh |

### Từ khóa · anh, ach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_chanh.mp3` | quả chanh |

### Âm, vần · anh, ach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ach.mp3` | ach |

### Đánh vần · anh, ach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-sach.mp3` | sach |
| ✅ | `tv-sachs.mp3` | sách |

### Tiếng · anh, ach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khachs.mp3` | khách |
| ✅ | `tv-sachj.mp3` | sạch |
| ✅ | `tv-gachj.mp3` | gạch |

### Từ khóa · anh, ach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quyeenr_sachs.mp3` | quyển sách |

### Câu ứng dụng · anh, ach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_ddocj_sachs_uoongs_nuwowcs_chanh.mp3` | bé đọc sách, uống nước chanh |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hai_vaanf_cos_chuwx_h_owr-1b5uz.mp3` | Hai vần có chữ h ở cuối: anh và ach. Đọc lướt nhẹ nhé! |

### Âm, vần · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-on.mp3` | on |

### Đánh vần · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-non.mp3` | non |
| ✅ | `tv-nons.mp3` | nón |

### Tiếng · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con.mp3` | con |
| ✅ | `tv-ngon.mp3` | ngon |
| ✅ | `tv-honf.mp3` | hòn |

### Từ khóa · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nons_las.mp3` | nón lá |

### Âm, vần · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oon.mp3` | ôn |

### Đánh vần · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-choon.mp3` | chôn |
| ✅ | `tv-choonf.mp3` | chồn |

### Tiếng · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thoon.mp3` | thôn |
| ✅ | `tv-khoon.mp3` | khôn |
| ✅ | `tv-troons.mp3` | trốn |

### Từ khóa · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_choonf.mp3` | con chồn |

### Âm, vần · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-own.mp3` | ơn |

### Đánh vần · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-sown.mp3` | sơn |

### Tiếng · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-lownj.mp3` | lợn |
| ✅ | `tv-hown.mp3` | hơn |
| ✅ | `tv-trown.mp3` | trơn |

### Từ khóa · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoopj_sown.mp3` | hộp sơn |

### Câu ứng dụng · on, ôn, ơn

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_choonf_ddooij_nons.mp3` | con chồn đội nón |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-o_oo_ow_gheps_vowis_nowf_thanhf_on_oon_own.mp3` | o, ô, ơ ghép với nờ thành on, ôn, ơn. |

### Âm, vần · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-om.mp3` | om |

### Đánh vần · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddom.mp3` | đom |
| ✅ | `tv-ddoms.mp3` | đóm |

### Tiếng · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chomf.mp3` | chòm |
| ✅ | `tv-khoms.mp3` | khóm |
| ✅ | `tv-bom.mp3` | bom |

### Từ khóa · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddom_ddoms.mp3` | đom đóm |

### Âm, vần · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oom.mp3` | ôm |

### Đánh vần · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-toom.mp3` | tôm |

### Tiếng · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-choom.mp3` | chôm |
| ✅ | `tv-noomf.mp3` | nồm |

### Từ khóa · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_toom.mp3` | con tôm |

### Âm, vần · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-owm.mp3` | ơm |

### Đánh vần · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cowm.mp3` | cơm |

### Tiếng · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thowm.mp3` | thơm |
| ✅ | `tv-rowm.mp3` | rơm |
| ✅ | `tv-bowmf.mp3` | bờm |

### Từ khóa · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bats_cowm.mp3` | bát cơm |

### Câu ứng dụng · om, ôm, ơm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cowm_thowm_toom_ngon.mp3` | cơm thơm, tôm ngon |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_om_oom_owm_cuoois_mowf_ngaamj_mooi_laij_nhes.mp3` | Vần om, ôm, ơm cuối mờ, ngậm môi lại nhé. |

### Âm, vần · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oi.mp3` | oi |

### Đánh vần · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-voi.mp3` | voi |

### Tiếng · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-coif.mp3` | còi |
| ✅ | `tv-nois.mp3` | nói |
| ✅ | `tv-ddoif.mp3` | đòi |

### Từ khóa · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_voi.mp3` | con voi |

### Âm, vần · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ooi.mp3` | ôi |

### Đánh vần · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chooi.mp3` | chôi |
| ✅ | `tv-chooir.mp3` | chổi |

### Tiếng · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddooi.mp3` | đôi |
| ✅ | `tv-tooi.mp3` | tôi |
| ✅ | `tv-goois.mp3` | gối |

### Từ khóa · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_chooir.mp3` | cái chổi |

### Âm, vần · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-owi.mp3` | ơi |

### Đánh vần · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bowi.mp3` | bơi |

### Tiếng · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chowi.mp3` | chơi |
| ✅ | `tv-mowis.mp3` | mới |
| ✅ | `tv-trowif.mp3` | trời |

### Từ khóa · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bowi_looij.mp3` | bơi lội |

### Câu ứng dụng · oi, ôi, ơi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-voi_con_ddi_bowi_ddi_chowi.mp3` | voi con đi bơi, đi chơi |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ba_vaanf_keets_thucs_bawngf_i_oi_ooi_owi.mp3` | Ba vần kết thúc bằng i: oi, ôi, ơi. |

### Âm, vần · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ot.mp3` | ot |

### Đánh vần · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngot.mp3` | ngot |
| ✅ | `tv-ngotj.mp3` | ngọt |

### Tiếng · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hots.mp3` | hót |
| ✅ | `tv-rots.mp3` | rót |
| ✅ | `tv-sotj.mp3` | sọt |

### Từ khóa · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-banhs_ngotj.mp3` | bánh ngọt |

### Âm, vần · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oot.mp3` | ôt |

### Đánh vần · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-root.mp3` | rôt |
| ✅ | `tv-roots.mp3` | rốt |

### Tiếng · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cootj.mp3` | cột |
| ✅ | `tv-mootj.mp3` | một |
| ✅ | `tv-toots.mp3` | tốt |

### Từ khóa · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caf_roots.mp3` | cà rốt |

### Âm, vần · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-owt.mp3` | ơt |

### Đánh vần · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-owts.mp3` | ớt |

### Tiếng · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vowtj.mp3` | vợt |
| ✅ | `tv-thowts.mp3` | thớt |
| ✅ | `tv-phowts.mp3` | phớt |

### Từ khóa · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_owts.mp3` | quả ớt |

### Câu ứng dụng · ot, ôt, ơt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chim_hots_banhs_ngotj.mp3` | chim hót, bánh ngọt |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_cuoois_towf_vowis_o_oo_ow_ddocj_ngawns_gonj.mp3` | Vần cuối tờ với o, ô, ơ. Đọc ngắn, gọn. |

### Âm, vần · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-op.mp3` | op |

### Đánh vần · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cop.mp3` | cop |
| ✅ | `tv-copj.mp3` | cọp |

### Tiếng · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hopj.mp3` | họp |
| ✅ | `tv-gops.mp3` | góp |
| ✅ | `tv-bops.mp3` | bóp |

### Từ khóa · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_copj.mp3` | con cọp |

### Âm, vần · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oop.mp3` | ôp |

### Đánh vần · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoop.mp3` | hôp |
| ✅ | `tv-hoopj.mp3` | hộp |

### Tiếng · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xoops.mp3` | xốp |
| ✅ | `tv-loopj.mp3` | lộp |
| ✅ | `tv-ddoopj.mp3` | độp |

### Từ khóa · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoopj_quaf.mp3` | hộp quà |

### Âm, vần · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-owp.mp3` | ơp |

### Đánh vần · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-lowp.mp3` | lơp |
| ✅ | `tv-lowps.mp3` | lớp |

### Tiếng · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chowps.mp3` | chớp |
| ✅ | `tv-howpj.mp3` | hợp |
| ✅ | `tv-ddowps.mp3` | đớp |

### Từ khóa · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-lowps_hocj.mp3` | lớp học |

### Câu ứng dụng · op, ôp, ơp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-car_lowps_gops_quaf_vaof_hoopj.mp3` | cả lớp góp quà vào hộp |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuoois_powf_thif_kheps_mooi_op_oop_owp.mp3` | Cuối pờ thì khép môi: op, ôp, ơp. |

### Âm, vần · oc, ôc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oc.mp3` | oc |

### Đánh vần · oc, ôc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-coc.mp3` | coc |
| ✅ | `tv-cocs.mp3` | cóc |

### Tiếng · oc, ôc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hocj.mp3` | học |
| ✅ | `tv-socs.mp3` | sóc |
| ✅ | `tv-khocs.mp3` | khóc |

### Từ khóa · oc, ôc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_cocs.mp3` | con cóc |

### Âm, vần · oc, ôc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ooc.mp3` | ôc |

### Đánh vần · oc, ôc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oocs.mp3` | ốc |

### Tiếng · oc, ôc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-goocs.mp3` | gốc |
| ✅ | `tv-doocs.mp3` | dốc |
| ✅ | `tv-coocs.mp3` | cốc |

### Từ khóa · oc, ôc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_oocs.mp3` | con ốc |

### Câu ứng dụng · oc, ôc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-socs_nhor_owr_goocs_caay.mp3` | sóc nhỏ ở gốc cây |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hai_vaanf_cuoois_cowf_oc_vaf_ooc.mp3` | Hai vần cuối cờ: oc và ôc. |

### Âm, vần · ong, ông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ong.mp3` | ong |

### Tiếng · ong, ông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bongs.mp3` | bóng |
| ✅ | `tv-trong.mp3` | trong |
| ✅ | `tv-vongx.mp3` | võng |

### Từ khóa · ong, ông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_ong.mp3` | con ong |

### Âm, vần · ong, ông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oong.mp3` | ông |

### Đánh vần · ong, ông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-troong.mp3` | trông |
| ✅ | `tv-troongs.mp3` | trống |

### Tiếng · ong, ông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-boong.mp3` | bông |
| ✅ | `tv-soong.mp3` | sông |

### Từ khóa · ong, ông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_troongs.mp3` | cái trống |

### Câu ứng dụng · ong, ông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ong_bay_qua_boong_hoa.mp3` | ong bay qua bông hoa |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_cuoois_ngowf_ong_vaf_oong-hf3mr.mp3` | Vần cuối ngờ: ong và ông. Nghe như tiếng chuông kêu boong boong. |

### Âm, vần · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-en.mp3` | en |

### Đánh vần · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ken.mp3` | ken |
| ✅ | `tv-kenf.mp3` | kèn |

### Tiếng · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-sen.mp3` | sen |
| ✅ | `tv-khen.mp3` | khen |
| ✅ | `tv-ddenf.mp3` | đèn |

### Từ khóa · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_kenf.mp3` | cái kèn |

### Âm, vần · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-een.mp3` | ên |

### Đánh vần · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-neen.mp3` | nên |
| ✅ | `tv-neens.mp3` | nến |

### Tiếng · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-teen.mp3` | tên |
| ✅ | `tv-leen.mp3` | lên |
| ✅ | `tv-beens.mp3` | bến |

### Từ khóa · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caay_neens.mp3` | cây nến |

### Âm, vần · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-in.mp3` | in |

### Đánh vần · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-pin.mp3` | pin |

### Tiếng · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xin.mp3` | xin |
| ✅ | `tv-tin.mp3` | tin |
| ✅ | `tv-chins.mp3` | chín |

### Từ khóa · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cucj_pin.mp3` | cục pin |

### Câu ứng dụng · en, ên, in

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_thooir_neens_car_nhaf_khen.mp3` | bé thổi nến, cả nhà khen |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-e_ee_i_gheps_vowis_nowf_en_een_in.mp3` | e, ê, i ghép với nờ: en, ên, in. |

### Âm, vần · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-em.mp3` | em |

### Đánh vần · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-kem.mp3` | kem |

### Tiếng · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xem.mp3` | xem |
| ✅ | `tv-tem.mp3` | tem |
| ✅ | `tv-lems.mp3` | lém |

### Từ khóa · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-que_kem.mp3` | que kem |

### Âm, vần · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eem.mp3` | êm |

### Đánh vần · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddeem.mp3` | đêm |

### Tiếng · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-meemf.mp3` | mềm |
| ✅ | `tv-theem.mp3` | thêm |
| ✅ | `tv-neemj.mp3` | nệm |

### Từ khóa · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ban_ddeem.mp3` | ban đêm |

### Âm, vần · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-im.mp3` | im |

### Đánh vần · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chim.mp3` | chim |

### Tiếng · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tims.mp3` | tím |
| ✅ | `tv-kim.mp3` | kim |
| ✅ | `tv-phims.mp3` | phím |

### Từ khóa · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_chim.mp3` | con chim |

### Câu ứng dụng · em, êm, im

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chim_veef_toor_khi_ddeem_xuoongs.mp3` | chim về tổ khi đêm xuống |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vaanf_cuoois_mowf_em_eem_im.mp3` | Vần cuối mờ: em, êm, im. |

### Âm, vần · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-et.mp3` | et |

### Đánh vần · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vet.mp3` | vet |
| ✅ | `tv-vetj.mp3` | vẹt |

### Tiếng · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bets.mp3` | bét |
| ✅ | `tv-hets.mp3` | hét |
| ✅ | `tv-kets.mp3` | két |

### Từ khóa · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_vetj.mp3` | con vẹt |

### Âm, vần · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eet.mp3` | êt |

### Đánh vần · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-teet.mp3` | têt |
| ✅ | `tv-teets.mp3` | tết |

### Tiếng · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-deetj.mp3` | dệt |
| ✅ | `tv-meetj.mp3` | mệt |
| ✅ | `tv-heets.mp3` | hết |

### Từ khóa · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngayf_teets.mp3` | ngày tết |

### Âm, vần · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-it.mp3` | it |

### Đánh vần · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vit.mp3` | vit |
| ✅ | `tv-vitj.mp3` | vịt |

### Tiếng · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mits.mp3` | mít |
| ✅ | `tv-thitj.mp3` | thịt |
| ✅ | `tv-chits.mp3` | chít |

### Từ khóa · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_vitj.mp3` | con vịt |

### Câu ứng dụng · et, êt, it

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-teets_nayf_bes_dduwowcj_lif_xif.mp3` | tết này bé được lì xì |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuoois_towf_et_eet_it_ddocj_gonj_nhuw_tieengs_gox_cuwar.mp3` | Cuối tờ: et, êt, it. Đọc gọn như tiếng gõ cửa. |

### Âm, vần · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ep.mp3` | ep |

### Đánh vần · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-dep.mp3` | dep |
| ✅ | `tv-deps.mp3` | dép |

### Tiếng · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddepj.mp3` | đẹp |
| ✅ | `tv-kepj.mp3` | kẹp |
| ✅ | `tv-teps.mp3` | tép |

### Từ khóa · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddooi_deps.mp3` | đôi dép |

### Âm, vần · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eep.mp3` | êp |

### Đánh vần · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-beep.mp3` | bêp |
| ✅ | `tv-beeps.mp3` | bếp |

### Tiếng · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xeeps.mp3` | xếp |
| ✅ | `tv-neeps.mp3` | nếp |

### Từ khóa · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhaf_beeps.mp3` | nhà bếp |

### Âm, vần · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ip.mp3` | ip |

### Đánh vần · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhip.mp3` | nhip |
| ✅ | `tv-nhipj.mp3` | nhịp |

### Tiếng · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-kipj.mp3` | kịp |
| ✅ | `tv-hips.mp3` | híp |

### Từ khóa · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhipj_troongs.mp3` | nhịp trống |

### Câu ứng dụng · ep, êp, ip

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mej_naaus_cowm_owr_beeps.mp3` | mẹ nấu cơm ở bếp |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuoois_powf_ep_eep_ip.mp3` | Cuối pờ: ep, êp, ip. |

### Âm, vần · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eo.mp3` | eo |

### Đánh vần · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-meo.mp3` | meo |
| ✅ | `tv-meof.mp3` | mèo |

### Tiếng · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-keoj.mp3` | kẹo |
| ✅ | `tv-leo.mp3` | leo |
| ✅ | `tv-treof.mp3` | trèo |

### Từ khóa · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_meof.mp3` | con mèo |

### Âm, vần · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eeu.mp3` | êu |

### Đánh vần · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-leeu.mp3` | lêu |
| ✅ | `tv-leeuf.mp3` | lều |

### Tiếng · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-keeu.mp3` | kêu |
| ✅ | `tv-neeus.mp3` | nếu |
| ✅ | `tv-ddeeuf.mp3` | đều |

### Từ khóa · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_leeuf.mp3` | cái lều |

### Âm, vần · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-iu.mp3` | iu |

### Đánh vần · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-riu.mp3` | riu |
| ✅ | `tv-riuf.mp3` | rìu |

### Tiếng · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-diuj.mp3` | dịu |
| ✅ | `tv-xius.mp3` | xíu |
| ✅ | `tv-chiuj.mp3` | chịu |

### Từ khóa · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_riuf.mp3` | cái rìu |

### Âm, vần · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ia.mp3` | ia |

### Đánh vần · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mia.mp3` | mia |
| ✅ | `tv-mias.mp3` | mía |

### Tiếng · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chia.mp3` | chia |
| ✅ | `tv-kia.mp3` | kia |
| ✅ | `tv-liaf.mp3` | lìa |

### Từ khóa · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caay_mias.mp3` | cây mía |

### Câu ứng dụng · eo, êu, iu, ia

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-meof_con_leo_caay_mias.mp3` | mèo con leo cây mía |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-boons_vaanf_nhor_xinh_eo_eeu_iu_ia.mp3` | Bốn vần nhỏ xinh: eo, êu, iu, ia. |

### Âm, vần · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eenh.mp3` | ênh |

### Đánh vần · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-keenh.mp3` | kênh |

### Tiếng · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-beenhj.mp3` | bệnh |
| ✅ | `tv-leenh.mp3` | lênh |
| ✅ | `tv-cheenh.mp3` | chênh |

### Từ khóa · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-dongf_keenh.mp3` | dòng kênh |

### Âm, vần · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-inh.mp3` | inh |

### Đánh vần · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-kinh.mp3` | kinh |
| ✅ | `tv-kinhs.mp3` | kính |

### Tiếng · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xinh.mp3` | xinh |
| ✅ | `tv-binhf.mp3` | bình |
| ✅ | `tv-tinhs.mp3` | tính |

### Từ khóa · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_kinhs.mp3` | cái kính |

### Âm, vần · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eech.mp3` | êch |

### Đánh vần · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eechs.mp3` | ếch |

### Tiếng · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-leechj.mp3` | lệch |
| ✅ | `tv-cheechs.mp3` | chếch |

### Từ khóa · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_eechs.mp3` | con ếch |

### Âm, vần · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ich.mp3` | ich |

### Đánh vần · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-lich.mp3` | lich |
| ✅ | `tv-lichj.mp3` | lịch |

### Tiếng · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thichs.mp3` | thích |
| ✅ | `tv-xichs.mp3` | xích |
| ✅ | `tv-ichs.mp3` | ích |

### Từ khóa · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-towf_lichj.mp3` | tờ lịch |

### Câu ứng dụng · ênh, inh, êch, ich

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-eechs_xinh_ngooif_been_keenh.mp3` | ếch xinh ngồi bên kênh |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-boons_vaanf_cos_chuwx_h_owr_cuoois_eenh_inh_eech_ich.mp3` | Bốn vần có chữ h ở cuối: ênh, inh, êch, ich. |

### Âm, vần · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-um.mp3` | um |

### Đánh vần · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chum.mp3` | chum |
| ✅ | `tv-chumf.mp3` | chùm |

### Tiếng · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tum.mp3` | tum |
| ✅ | `tv-khum.mp3` | khum |
| ✅ | `tv-cums.mp3` | cúm |

### Âm, vần · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-un.mp3` | un |

### Đánh vần · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-giun.mp3` | giun |

### Tiếng · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-buns.mp3` | bún |
| ✅ | `tv-munf.mp3` | mùn |
| ✅ | `tv-ddunf.mp3` | đùn |

### Từ khóa · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_giun.mp3` | con giun |

### Âm, vần · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ui.mp3` | ui |

### Đánh vần · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nui.mp3` | nui |
| ✅ | `tv-nuis.mp3` | núi |

### Tiếng · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tuis.mp3` | túi |
| ✅ | `tv-vui.mp3` | vui |
| ✅ | `tv-muix.mp3` | mũi |

### Từ khóa · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngonj_nuis.mp3` | ngọn núi |

### Âm, vần · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwi.mp3` | ưi |

### Đánh vần · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nguwi.mp3` | ngưi |
| ✅ | `tv-nguwir.mp3` | ngửi |

### Tiếng · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-guwir.mp3` | gửi |
| ✅ | `tv-cuwir.mp3` | cửi |

### Từ khóa · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nguwir_hoa.mp3` | ngửi hoa |

### Câu ứng dụng · um, un, ui, ưi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_vui_ddi_chowi_nuis.mp3` | bé vui đi chơi núi |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-u_vaf_uw_gheps_vowis_cacs_aam_cuoois_um_un_ui_uwi.mp3` | u và ư ghép với các âm cuối: um, un, ui, ưi. |

### Âm, vần · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-up.mp3` | up |

### Đánh vần · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bup.mp3` | bup |
| ✅ | `tv-bups.mp3` | búp |

### Tiếng · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-giups.mp3` | giúp |
| ✅ | `tv-chupj.mp3` | chụp |
| ✅ | `tv-nups.mp3` | núp |

### Từ khóa · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bups_sen.mp3` | búp sen |

### Âm, vần · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ut.mp3` | ut |

### Đánh vần · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-but.mp3` | but |
| ✅ | `tv-buts.mp3` | bút |

### Tiếng · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-phuts.mp3` | phút |
| ✅ | `tv-suts.mp3` | sút |
| ✅ | `tv-huts.mp3` | hút |

### Từ khóa · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caay_buts.mp3` | cây bút |

### Âm, vần · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwt.mp3` | ưt |

### Đánh vần · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-muwt.mp3` | mưt |
| ✅ | `tv-muwts.mp3` | mứt |

### Tiếng · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-dduwts.mp3` | đứt |
| ✅ | `tv-nuwts.mp3` | nứt |
| ✅ | `tv-suwts.mp3` | sứt |

### Từ khóa · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoopj_muwts.mp3` | hộp mứt |

### Câu ứng dụng · up, ut, ưt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_caamf_buts_giups_mej.mp3` | bé cầm bút giúp mẹ |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuoois_powf_vaf_towf_up_ut_uwt.mp3` | Cuối pờ và tờ: up, ut, ưt. |

### Âm, vần · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uc.mp3` | uc |

### Đánh vần · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuc.mp3` | cuc |
| ✅ | `tv-cucs.mp3` | cúc |

### Tiếng · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mucs.mp3` | múc |
| ✅ | `tv-trucs.mp3` | trúc |
| ✅ | `tv-cucj.mp3` | cục |

### Từ khóa · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoa_cucs.mp3` | hoa cúc |

### Âm, vần · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwc.mp3` | ưc |

### Đánh vần · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-muwc.mp3` | mưc |
| ✅ | `tv-muwcj.mp3` | mực |

### Tiếng · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-dduwcs.mp3` | đức |
| ✅ | `tv-suwcs.mp3` | sức |
| ✅ | `tv-thuwcs.mp3` | thức |

### Từ khóa · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_muwcj.mp3` | con mực |

### Âm, vần · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ung.mp3` | ung |

### Đánh vần · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thung.mp3` | thung |
| ✅ | `tv-thungs.mp3` | thúng |

### Tiếng · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-sung.mp3` | sung |
| ✅ | `tv-trung.mp3` | trung |
| ✅ | `tv-rung.mp3` | rung |

### Từ khóa · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_thungs.mp3` | cái thúng |

### Âm, vần · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwng.mp3` | ưng |

### Đánh vần · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-truwng.mp3` | trưng |
| ✅ | `tv-truwngs.mp3` | trứng |

### Tiếng · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-luwng.mp3` | lưng |
| ✅ | `tv-suwngf.mp3` | sừng |
| ✅ | `tv-muwngf.mp3` | mừng |

### Từ khóa · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_truwngs.mp3` | quả trứng |

### Câu ứng dụng · uc, ưc, ung, ưng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-gaf_mej_aaps_truwngs.mp3` | gà mẹ ấp trứng |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuoois_cowf_vaf_ngowf_uc_uwc_ung_uwng.mp3` | Cuối cờ và ngờ: uc, ưc, ung, ưng. |

### Âm, vần · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ua.mp3` | ua |

### Đánh vần · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cua.mp3` | cua |

### Tiếng · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mua.mp3` | mua |
| ✅ | `tv-ruaf.mp3` | rùa |
| ✅ | `tv-dduax.mp3` | đũa |

### Từ khóa · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_cua.mp3` | con cua |

### Âm, vần · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwa.mp3` | ưa |

### Đánh vần · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nguwa.mp3` | ngưa |
| ✅ | `tv-nguwaj.mp3` | ngựa |

### Tiếng · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-muwa.mp3` | mưa |
| ✅ | `tv-duwa.mp3` | dưa |
| ✅ | `tv-cuwar.mp3` | cửa |

### Từ khóa · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_nguwaj.mp3` | con ngựa |

### Âm, vần · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwu.mp3` | ưu |

### Đánh vần · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuwu.mp3` | cưu |
| ✅ | `tv-cuwuf.mp3` | cừu |

### Tiếng · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-huwu.mp3` | hưu |
| ✅ | `tv-cuwus.mp3` | cứu |
| ✅ | `tv-luwuj.mp3` | lựu |

### Từ khóa · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_cuwuf.mp3` | con cừu |

### Câu ứng dụng · ua, ưa, ưu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-trowif_muwa_cua_bof_ra.mp3` | trời mưa, cua bò ra |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ua_ddocj_nhuw_u_a_uwa_ddocj_nhuw_uw_a_uwu_ddocj_nhuw_uw_u.mp3` | ua đọc như u-a, ưa đọc như ư-a, ưu đọc như ư-u. |

### Âm, vần · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ieen.mp3` | iên |

### Đánh vần · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-kieen.mp3` | kiên |
| ✅ | `tv-kieens.mp3` | kiến |

### Tiếng · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tieen.mp3` | tiên |
| ✅ | `tv-bieenr.mp3` | biển |
| ✅ | `tv-ddieenj.mp3` | điện |

### Từ khóa · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_kieens.mp3` | con kiến |

### Âm, vần · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ieet.mp3` | iêt |

### Đánh vần · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vieet.mp3` | viêt |
| ✅ | `tv-vieets.mp3` | viết |

### Tiếng · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bieets.mp3` | biết |
| ✅ | `tv-tieets.mp3` | tiết |
| ✅ | `tv-vieetj.mp3` | việt |

### Từ khóa · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-taapj_vieets.mp3` | tập viết |

### Âm, vần · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ieeu.mp3` | iêu |

### Đánh vần · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-dieeu.mp3` | diêu |
| ✅ | `tv-dieeuf.mp3` | diều |

### Tiếng · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhieeuf.mp3` | nhiều |
| ✅ | `tv-chieeuf.mp3` | chiều |
| ✅ | `tv-tieeu.mp3` | tiêu |

### Từ khóa · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-canhs_dieeuf.mp3` | cánh diều |

### Âm, vần · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-yeeu.mp3` | yêu |

### Tiếng · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-yeeus.mp3` | yếu |

### Từ khóa · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-yeeu_baf.mp3` | yêu bà |

### Câu ứng dụng · iên, iêt, iêu, yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chieeuf_chieeuf_bes_thar_dieeuf.mp3` | chiều chiều bé thả diều |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-iee_ddocj_gaanf_nhuw_ia_gheps-wj6vz.mp3` | iê đọc gần như ia. Ghép với nờ thành iên, với tờ thành iêt. |

### Âm, vần · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ieeng.mp3` | iêng |

### Đánh vần · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chieeng.mp3` | chiêng |

### Tiếng · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-rieeng.mp3` | riêng |
| ✅ | `tv-lieengj.mp3` | liệng |
| ✅ | `tv-kieengf.mp3` | kiềng |

### Từ khóa · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_chieeng.mp3` | cái chiêng |

### Âm, vần · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ieec.mp3` | iêc |

### Đánh vần · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xieec.mp3` | xiêc |
| ✅ | `tv-xieecs.mp3` | xiếc |

### Tiếng · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tieecj.mp3` | tiệc |
| ✅ | `tv-vieecj.mp3` | việc |
| ✅ | `tv-chieecs.mp3` | chiếc |

### Từ khóa · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-rapj_xieecs.mp3` | rạp xiếc |

### Âm, vần · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ieem.mp3` | iêm |

### Đánh vần · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-dieem.mp3` | diêm |

### Tiếng · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-kieems.mp3` | kiếm |
| ✅ | `tv-ddieemr.mp3` | điểm |
| ✅ | `tv-tieemj.mp3` | tiệm |

### Từ khóa · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-que_dieem.mp3` | que diêm |

### Âm, vần · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ieep.mp3` | iêp |

### Đánh vần · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thieep.mp3` | thiêp |
| ✅ | `tv-thieeps.mp3` | thiếp |

### Tiếng · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-kieeps.mp3` | kiếp |
| ✅ | `tv-nghieepj.mp3` | nghiệp |
| ✅ | `tv-dieeps.mp3` | diếp |

### Từ khóa · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-taams_thieeps.mp3` | tấm thiếp |

### Câu ứng dụng · iêng, iêc, iêm, iêp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-car_nhaf_ddi_xem_xieecs.mp3` | cả nhà đi xem xiếc |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-theem_boons_vaanf_cos_iee_nuwax_nef.mp3` | Thêm bốn vần có iê nữa nè! |

### Âm, vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uoon.mp3` | uôn |

### Đánh vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuoon.mp3` | cuôn |
| ✅ | `tv-cuoonj.mp3` | cuộn |

### Tiếng · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-muoons.mp3` | muốn |
| ✅ | `tv-buoonf.mp3` | buồn |
| ✅ | `tv-luoon.mp3` | luôn |

### Từ khóa · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuoonj_len.mp3` | cuộn len |

### Âm, vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uoot.mp3` | uôt |

### Đánh vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chuoot.mp3` | chuôt |
| ✅ | `tv-chuootj.mp3` | chuột |

### Tiếng · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-suoots.mp3` | suốt |
| ✅ | `tv-tuoots.mp3` | tuốt |
| ✅ | `tv-buootj.mp3` | buột |

### Từ khóa · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_chuootj.mp3` | con chuột |

### Âm, vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uooi.mp3` | uôi |

### Đánh vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chuooi.mp3` | chuôi |
| ✅ | `tv-chuoois.mp3` | chuối |

### Tiếng · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-muoois.mp3` | muối |
| ✅ | `tv-suoois.mp3` | suối |
| ✅ | `tv-dduooi.mp3` | đuôi |

### Từ khóa · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_chuoois.mp3` | quả chuối |

### Âm, vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uooc.mp3` | uôc |

### Đánh vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-dduooc.mp3` | đuôc |
| ✅ | `tv-dduoocs.mp3` | đuốc |

### Tiếng · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thuoocs.mp3` | thuốc |
| ✅ | `tv-cuoocs.mp3` | cuốc |
| ✅ | `tv-buoocj.mp3` | buộc |

### Từ khóa · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngonj_dduoocs.mp3` | ngọn đuốc |

### Âm, vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uoong.mp3` | uông |

### Đánh vần · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chuoong.mp3` | chuông |

### Tiếng · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vuoong.mp3` | vuông |
| ✅ | `tv-xuoongs.mp3` | xuống |
| ✅ | `tv-uoongs.mp3` | uống |

### Từ khóa · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_chuoong.mp3` | cái chuông |

### Câu ứng dụng · uôn, uôt, uôi, uôc, uông

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chuootj_con_awn_chuoois_been_suoois.mp3` | chuột con ăn chuối bên suối |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uoo_ddocj_gaanf_nhuw_ua_nawm-1i12v.mp3` | uô đọc gần như ua. Năm vần trong một bài, bé làm được! |

### Âm, vần · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwown.mp3` | ươn |

### Đánh vần · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vuwown.mp3` | vươn |
| ✅ | `tv-vuwownf.mp3` | vườn |

### Tiếng · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-luwownj.mp3` | lượn |
| ✅ | `tv-muwownj.mp3` | mượn |
| ✅ | `tv-suwownf.mp3` | sườn |

### Từ khóa · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khu_vuwownf.mp3` | khu vườn |

### Âm, vần · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwowt.mp3` | ươt |

### Đánh vần · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-luwowt.mp3` | lươt |
| ✅ | `tv-luwowts.mp3` | lướt |

### Tiếng · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-muwowtj.mp3` | mượt |
| ✅ | `tv-truwowtj.mp3` | trượt |
| ✅ | `tv-vuwowtj.mp3` | vượt |

### Từ khóa · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-luwowts_vans.mp3` | lướt ván |

### Âm, vần · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwowi.mp3` | ươi |

### Đánh vần · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-luwowi.mp3` | lươi |
| ✅ | `tv-luwowis.mp3` | lưới |

### Tiếng · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tuwowi.mp3` | tươi |
| ✅ | `tv-cuwowif.mp3` | cười |
| ✅ | `tv-muwowif.mp3` | mười |

### Từ khóa · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_luwowis.mp3` | cái lưới |

### Âm, vần · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwowc.mp3` | ươc |

### Đánh vần · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thuwowc.mp3` | thươc |
| ✅ | `tv-thuwowcs.mp3` | thước |

### Tiếng · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nuwowcs.mp3` | nước |
| ✅ | `tv-buwowcs.mp3` | bước |
| ✅ | `tv-dduwowcj.mp3` | được |

### Từ khóa · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caay_thuwowcs.mp3` | cây thước |

### Câu ứng dụng · ươn, ươt, ươi, ươc

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_tuwowis_nuwowcs_cho_vuwownf.mp3` | bé tưới nước cho vườn |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwow_ddocj_gaanf_nhuw_uwa_vuwownf_luwowts_luwowis_thuwowcs.mp3` | ươ đọc gần như ưa. Vườn, lướt, lưới, thước! |

### Âm, vần · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwowng.mp3` | ương |

### Đánh vần · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-giuwowng.mp3` | giương |
| ✅ | `tv-giuwowngf.mp3` | giường |

### Tiếng · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-huwowng.mp3` | hương |
| ✅ | `tv-suwowng.mp3` | sương |
| ✅ | `tv-dduwowngf.mp3` | đường |

### Từ khóa · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_giuwowngf.mp3` | cái giường |

### Âm, vần · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwowu.mp3` | ươu |

### Đánh vần · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-huwowu.mp3` | hươu |

### Tiếng · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ruwowuj.mp3` | rượu |
| ✅ | `tv-buwowus.mp3` | bướu |

### Từ khóa · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_huwowu.mp3` | con hươu |

### Âm, vần · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwowm.mp3` | ươm |

### Đánh vần · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-buwowm.mp3` | bươm |
| ✅ | `tv-buwowms.mp3` | bướm |

### Tiếng · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-guwowm.mp3` | gươm |
| ✅ | `tv-luwowmj.mp3` | lượm |
| ✅ | `tv-uwowms.mp3` | ướm |

### Từ khóa · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_buwowms.mp3` | con bướm |

### Âm, vần · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uwowp.mp3` | ươp |

### Đánh vần · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-muwowp.mp3` | mươp |
| ✅ | `tv-muwowps.mp3` | mướp |

### Tiếng · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuwowps.mp3` | cướp |

### Từ khóa · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_muwowps.mp3` | quả mướp |

### Câu ứng dụng · ương, ươu, ươm, ươp

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-buwowms_bay_quanh_gianf_muwowps.mp3` | bướm bay quanh giàn mướp |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-theem_boons_vaanf_uwow_nuwax_sawps_xong_chawngj_rooif.mp3` | Thêm bốn vần ươ nữa. Sắp xong chặng rồi! |

### Âm, vần · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oa.mp3` | oa |

### Đánh vần · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoa.mp3` | hoa |

### Tiếng · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-loa.mp3` | loa |
| ✅ | `tv-toaf.mp3` | tòa |
| ✅ | `tv-xoas.mp3` | xóa |

### Từ khóa · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-boong_hoa.mp3` | bông hoa |

### Âm, vần · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oe.mp3` | oe |

### Đánh vần · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khoe.mp3` | khoe |
| ✅ | `tv-khoer.mp3` | khỏe |

### Tiếng · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xoef.mp3` | xòe |
| ✅ | `tv-choef.mp3` | chòe |
| ✅ | `tv-hoe.mp3` | hoe |

### Từ khóa · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khoer_manhj.mp3` | khỏe mạnh |

### Âm, vần · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uee.mp3` | uê |

### Đánh vần · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-huee.mp3` | huê |
| ✅ | `tv-hueej.mp3` | huệ |

### Tiếng · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thuee.mp3` | thuê |
| ✅ | `tv-thuees.mp3` | thuế |

### Từ khóa · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoa_hueej.mp3` | hoa huệ |

### Âm, vần · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uy.mp3` | uy |

### Đánh vần · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thuy.mp3` | thuy |
| ✅ | `tv-thuyr.mp3` | thủy |

### Tiếng · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-luyx.mp3` | lũy |
| ✅ | `tv-huy.mp3` | huy |
| ✅ | `tv-tuyf.mp3` | tùy |

### Từ khóa · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tauf_thuyr.mp3` | tàu thủy |

### Câu ứng dụng · oa, oe, uê, uy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoa_nowr_bes_khoer.mp3` | hoa nở, bé khỏe |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chuwx_o_u_dduwngs_truwowcs_lamf-15p2u.mp3` | Chữ o, u đứng trước làm âm đệm, môi tròn lại: oa, oe, uê, uy. |

### Âm, vần · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oan.mp3` | oan |

### Đánh vần · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-toan.mp3` | toan |
| ✅ | `tv-toans.mp3` | toán |

### Tiếng · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngoan.mp3` | ngoan |
| ✅ | `tv-khoan.mp3` | khoan |
| ✅ | `tv-ddoanf.mp3` | đoàn |

### Từ khóa · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hocj_toans.mp3` | học toán |

### Âm, vần · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oawn.mp3` | oăn |

### Đánh vần · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xoawn.mp3` | xoăn |

### Tiếng · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thoawn.mp3` | thoăn |
| ✅ | `tv-ngoawnf.mp3` | ngoằn |

### Từ khóa · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tocs_xoawn.mp3` | tóc xoăn |

### Âm, vần · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oat.mp3` | oat |

### Đánh vần · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoat.mp3` | hoat |
| ✅ | `tv-hoatj.mp3` | hoạt |

### Tiếng · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thoats.mp3` | thoát |
| ✅ | `tv-toats.mp3` | toát |
| ✅ | `tv-loats.mp3` | loát |

### Từ khóa · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoatj_hinhf.mp3` | hoạt hình |

### Âm, vần · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oawt.mp3` | oăt |

### Đánh vần · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngoawt.mp3` | ngoăt |
| ✅ | `tv-ngoawtj.mp3` | ngoặt |

### Tiếng · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-choawts.mp3` | choắt |
| ✅ | `tv-hoawts.mp3` | hoắt |

### Từ khóa · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khucs_ngoawtj.mp3` | khúc ngoặt |

### Câu ứng dụng · oan, oăn, oat, oăt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_ngoan_hocj_toans.mp3` | bé ngoan học toán |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-o_dduwngs_truwowcs_an_awn_at_awt_thanhf_oan_oawn_oat_oawt.mp3` | o đứng trước an, ăn, at, ăt thành oan, oăn, oat, oăt. |

### Âm, vần · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oang.mp3` | oang |

### Đánh vần · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khoang.mp3` | khoang |

### Tiếng · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoangf.mp3` | hoàng |
| ✅ | `tv-loang.mp3` | loang |
| ✅ | `tv-choangf.mp3` | choàng |

### Từ khóa · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khoang_tauf.mp3` | khoang tàu |

### Âm, vần · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oawng.mp3` | oăng |

### Đánh vần · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoawng.mp3` | hoăng |
| ✅ | `tv-hoawngx.mp3` | hoẵng |

### Tiếng · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-loawngf.mp3` | loằng |
| ✅ | `tv-ngoawngx.mp3` | ngoẵng |

### Từ khóa · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_hoawngx.mp3` | con hoẵng |

### Âm, vần · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oanh.mp3` | oanh |

### Đánh vần · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khoanh.mp3` | khoanh |

### Tiếng · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-doanh.mp3` | doanh |
| ✅ | `tv-loanh.mp3` | loanh |

### Từ khóa · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khoanh_tay.mp3` | khoanh tay |

### Âm, vần · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oach.mp3` | oach |

### Đánh vần · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-hoach.mp3` | hoach |
| ✅ | `tv-hoachj.mp3` | hoạch |

### Tiếng · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-toachj.mp3` | toạch |
| ✅ | `tv-xoachj.mp3` | xoạch |

### Từ khóa · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thu_hoachj.mp3` | thu hoạch |

### Câu ứng dụng · oang, oăng, oanh, oach

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_khoanh_tay_chaof_coo.mp3` | bé khoanh tay chào cô |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-boons_vaanf_daif_maf_vaanx_deex_oang_oawng_oanh_oach.mp3` | Bốn vần dài mà vẫn dễ: oang, oăng, oanh, oach. |

### Âm, vần · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oai.mp3` | oai |

### Đánh vần · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thoai.mp3` | thoai |
| ✅ | `tv-thoaij.mp3` | thoại |

### Tiếng · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ngoaif.mp3` | ngoài |
| ✅ | `tv-khoai.mp3` | khoai |
| ✅ | `tv-loaif.mp3` | loài |

### Từ khóa · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddieenj_thoaij.mp3` | điện thoại |

### Âm, vần · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oay.mp3` | oay |

### Đánh vần · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xoay.mp3` | xoay |

### Tiếng · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-loay.mp3` | loay |
| ✅ | `tv-ngoays.mp3` | ngoáy |
| ✅ | `tv-hoays.mp3` | hoáy |

### Từ khóa · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chong_chongs_xoay.mp3` | chong chóng xoay |

### Âm, vần · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uaan.mp3` | uân |

### Đánh vần · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-xuaan.mp3` | xuân |

### Tiếng · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tuaanf.mp3` | tuần |
| ✅ | `tv-luaanj.mp3` | luận |
| ✅ | `tv-huaans.mp3` | huấn |

### Từ khóa · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-muaf_xuaan.mp3` | mùa xuân |

### Âm, vần · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uaat.mp3` | uât |

### Đánh vần · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thuaat.mp3` | thuât |
| ✅ | `tv-thuaatj.mp3` | thuật |

### Tiếng · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-luaatj.mp3` | luật |
| ✅ | `tv-xuaats.mp3` | xuất |
| ✅ | `tv-khuaats.mp3` | khuất |

### Từ khóa · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mix_thuaatj.mp3` | mĩ thuật |

### Câu ứng dụng · oai, oay, uân, uât

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-muaf_xuaan_bes_troongf_khoai.mp3` | mùa xuân, bé trồng khoai |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oai_oay_uaan_uaat_muaf_xuaan_ddeens_rooif.mp3` | oai, oay, uân, uât. Mùa xuân đến rồi! |

### Âm, vần · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uyeen.mp3` | uyên |

### Mảnh vần (đánh vần)

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-yeen.mp3` | yên |

### Đánh vần · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thuyeen.mp3` | thuyên |
| ✅ | `tv-thuyeenf.mp3` | thuyền |

### Tiếng · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chuyeenj.mp3` | chuyện |
| ✅ | `tv-khuyeen.mp3` | khuyên |
| ✅ | `tv-luyeenj.mp3` | luyện |

### Từ khóa · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_thuyeenf.mp3` | con thuyền |

### Âm, vần · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uyeet.mp3` | uyêt |

### Mảnh vần (đánh vần)

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-yeet.mp3` | yêt |

### Đánh vần · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-tuyeet.mp3` | tuyêt |
| ✅ | `tv-tuyeets.mp3` | tuyết |

### Tiếng · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-duyeetj.mp3` | duyệt |
| ✅ | `tv-huyeets.mp3` | huyết |
| ✅ | `tv-khuyeets.mp3` | khuyết |

### Từ khóa · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-boong_tuyeets.mp3` | bông tuyết |

### Âm, vần · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uynh.mp3` | uynh |

### Mảnh vần (đánh vần)

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ynh.mp3` | ynh |

### Đánh vần · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-huynh.mp3` | huynh |

### Tiếng · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khuynhf.mp3` | khuỳnh |
| ✅ | `tv-huynhf.mp3` | huỳnh |

### Từ khóa · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-phuj_huynh.mp3` | phụ huynh |

### Âm, vần · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-uych.mp3` | uych |

### Mảnh vần (đánh vần)

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ych.mp3` | ych |

### Đánh vần · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-huych.mp3` | huych |
| ✅ | `tv-huychj.mp3` | huỵch |

### Tiếng · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-huychs.mp3` | huých |
| ✅ | `tv-uychj.mp3` | uỵch |

### Từ khóa · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chayj_huychj_huychj.mp3` | chạy huỵch huỵch |

### Câu ứng dụng · uyên, uyêt, uynh, uych

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thuyeenf_ddi_treen_bieenr_tuyeets.mp3` | thuyền đi trên biển tuyết |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-boons_vaanf_khos_nhaats_rooif_ddocj-83m7t.mp3` | Bốn vần khó nhất rồi! Đọc chậm, từng phần một nhé. |
| ✅ | `tv-hai_tieengs_gheps_laij_thanhf_mootj-3avrd.mp3` | Hai tiếng ghép lại thành một từ. Đọc liền hai tiếng, không ngắt quãng nhé. |

### Câu hỏi đọc hiểu · Từ quanh nhà

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddoof_vaatj_naof_ddeer_ngooif.mp3` | Đồ vật nào để ngồi? |
| ✅ | `tv-ddoof_vaatj_naof_cho_anhs_sangs.mp3` | Đồ vật nào cho ánh sáng? |

### Bài đọc · Từ quanh nhà

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cuwar_soor.mp3` | cửa sổ |
| ✅ | `tv-bongs_ddenf.mp3` | bóng đèn |
| ✅ | `tv-tur_lanhj.mp3` | tủ lạnh |
| ✅ | `tv-banf_chair.mp3` | bàn chải |

### Cả bài · Từ quanh nhà

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cais_banf_cuwar_soor_cais_ghees-se3ir.mp3` | cái bàn cửa sổ cái ghế bóng đèn tủ lạnh bàn chải |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-goij_teen_cacs_con_vaatj_naof.mp3` | Gọi tên các con vật nào! |

### Câu hỏi đọc hiểu · Con vật bé yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_gif_keeu_meo_meo.mp3` | Con gì kêu meo meo? |
| ✅ | `tv-con_gif_bieets_bay.mp3` | Con gì biết bay? |

### Bài đọc · Con vật bé yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-chus_chos.mp3` | chú chó |
| ✅ | `tv-ddanf_vitj.mp3` | đàn vịt |
| ✅ | `tv-chim_ser.mp3` | chim sẻ |
| ✅ | `tv-con_traau.mp3` | con trâu |

### Cả bài · Con vật bé yêu

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-con_meof_chus_chos_con_gaf_ddanf_vitj_chim_ser_con_traau.mp3` | con mèo chú chó con gà đàn vịt chim sẻ con trâu |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddocj_to_teen_trais_caay_vaf_mauf_sawcs_nhes.mp3` | Đọc to tên trái cây và màu sắc nhé. |

### Câu hỏi đọc hiểu · Màu sắc, trái cây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_chuoois_chins_cos_mauf_gif.mp3` | Quả chuối chín có màu gì? |
| ✅ | `tv-duwa_haaus_ruootj_mauf_gif.mp3` | Dưa hấu ruột màu gì? |

### Bài đọc · Màu sắc, trái cây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-duwa_haaus.mp3` | dưa hấu |
| ✅ | `tv-mauf_ddor.mp3` | màu đỏ |
| ✅ | `tv-mauf_xanh.mp3` | màu xanh |
| ✅ | `tv-trais_xoaif.mp3` | trái xoài |

### Cả bài · Màu sắc, trái cây

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-quar_cam_duwa_haaus_mauf_ddor-cw6l7.mp3` | quả cam dưa hấu màu đỏ màu xanh quả chuối trái xoài |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mootj_caau_bawts_ddaauf_bawngf_chuwx-gzujw.mp3` | Một câu bắt đầu bằng chữ viết hoa và kết thúc bằng dấu chấm. Đến dấu chấm thì nghỉ một chút. |

### Câu hỏi đọc hiểu · Câu và dấu chấm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ai_naaus_cowm.mp3` | Ai nấu cơm? |
| ✅ | `tv-meof_ddang_lamf_gif.mp3` | Mèo đang làm gì? |

### Bài đọc · Câu và dấu chấm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_ddi_hocj.mp3` | Bé đi học. |
| ✅ | `tv-mej_naaus_cowm.mp3` | Mẹ nấu cơm. |
| ✅ | `tv-meof_nawmf_ngur.mp3` | Mèo nằm ngủ. |
| ✅ | `tv-boos_ddocj_baos.mp3` | Bố đọc báo. |
| ✅ | `tv-chim_hots_treen_caay.mp3` | Chim hót trên cây. |

### Cả bài · Câu và dấu chấm

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-bes_ddi_hocj_mej_naaus_cowm-azxhj.mp3` | Bé đi học. Mẹ nấu cơm. Mèo nằm ngủ. Bố đọc báo. Chim hót trên cây. |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-daaus_phaayr_gioongs_choox_nghir_chaan-g0bu9.mp3` | Dấu phẩy giống chỗ nghỉ chân. Đến dấu phẩy thì ngắt hơi thật ngắn. |

### Câu hỏi đọc hiểu · Dấu phẩy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-vuwownf_nhaf_baf_cos_gif.mp3` | Vườn nhà bà có gì? |
| ✅ | `tv-mochi_thichs_gif.mp3` | Mochi thích gì? |

### Bài đọc · Dấu phẩy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-sangs_nay_bes_daayj_sowms.mp3` | Sáng nay, bé dậy sớm. |
| ✅ | `tv-vuwownf_nhaf_baf_cos_cam_cos_buwowir.mp3` | Vườn nhà bà có cam, có bưởi. |
| ✅ | `tv-mochi_thichs_cas_thichs_suwax.mp3` | Mochi thích cá, thích sữa. |
| ✅ | `tv-trowif_nawngs_gios_thooir_nhej.mp3` | Trời nắng, gió thổi nhẹ. |

### Cả bài · Dấu phẩy

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-sangs_nay_bes_daayj_sowms_vuwownf-z0z52.mp3` | Sáng nay, bé dậy sớm. Vườn nhà bà có cam, có bưởi. Mochi thích cá, thích sữa. Trời nắng, gió thổi nhẹ. |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caau_hoir_keets_thucs_bawngf_daaus-110ad.mp3` | Câu hỏi kết thúc bằng dấu chấm hỏi. Đọc thì giọng cao lên một chút ở cuối câu. |

### Câu hỏi đọc hiểu · Câu hỏi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-caau_hoir_keets_thucs_bawngf_daaus_gif.mp3` | Câu hỏi kết thúc bằng dấu gì? |

### Bài đọc · Câu hỏi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-banj_teen_laf_gif.mp3` | Bạn tên là gì? |
| ✅ | `tv-hoom_nay_trowif_cos_muwa_khoong.mp3` | Hôm nay trời có mưa không? |
| ✅ | `tv-ai_ddang_hats_thees.mp3` | Ai đang hát thế? |
| ✅ | `tv-meof_con_ddi_ddaau.mp3` | Mèo con đi đâu? |

### Cả bài · Câu hỏi

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-banj_teen_laf_gif_hoom_nay-c5c7s.mp3` | Bạn tên là gì? Hôm nay trời có mưa không? Ai đang hát thế? Mèo con đi đâu? |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-baay_giowf_minhf_ddocj_car_mootj-1i776.mp3` | Bây giờ mình đọc cả một đoạn. Đọc từng câu, nghỉ đúng chỗ dấu chấm nhé. |

### Câu hỏi đọc hiểu · Mochi đi học

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ai_dduwa_mochi_ddeens_lowps.mp3` | Ai đưa Mochi đến lớp? |
| ✅ | `tv-owr_lowps_mochi_dduwowcj_ai_khen.mp3` | Ở lớp, Mochi được ai khen? |

### Bài đọc · Mochi đi học

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-sangs_nay_mochi_daayj_thaatj_sowms.mp3` | Sáng nay, Mochi dậy thật sớm. |
| ✅ | `tv-mochi_ddanhs_rawng_ruwar_mawtj_rooif_awn_sangs.mp3` | Mochi đánh răng, rửa mặt rồi ăn sáng. |
| ✅ | `tv-mej_dduwa_mochi_ddeens_lowps.mp3` | Mẹ đưa Mochi đến lớp. |
| ✅ | `tv-owr_lowps_mochi_dduwowcj_coo_khen_ngoan.mp3` | Ở lớp, Mochi được cô khen ngoan. |

### Cả bài · Mochi đi học

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-sangs_nay_mochi_daayj_thaatj_sowms-7l03i.mp3` | Sáng nay, Mochi dậy thật sớm. Mochi đánh răng, rửa mặt rồi ăn sáng. Mẹ đưa Mochi đến lớp. Ở lớp, Mochi được cô khen ngoan. |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-cungf_ddeens_thawm_vuwownf_nhaf_baf_naof.mp3` | Cùng đến thăm vườn nhà bà nào! |

### Câu hỏi đọc hiểu · Khu vườn của bà

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mooix_sangs_baf_lamf_gif.mp3` | Mỗi sáng, bà làm gì? |
| ✅ | `tv-con_gif_bay_ddeens_hots.mp3` | Con gì bay đến hót? |

### Bài đọc · Khu vườn của bà

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhaf_baf_cos_mootj_khu_vuwownf_nhor.mp3` | Nhà bà có một khu vườn nhỏ. |
| ✅ | `tv-trong_vuwownf_cos_caay_cam_caay_buwowir_vaf_luoongs_rau_xanh.mp3` | Trong vườn có cây cam, cây bưởi và luống rau xanh. |
| ✅ | `tv-mooix_sangs_baf_ra_vuwownf_tuwowis_nuwowcs.mp3` | Mỗi sáng, bà ra vườn tưới nước. |
| ✅ | `tv-bes_thichs_theo_baf_nhawtj_las_vangf.mp3` | Bé thích theo bà nhặt lá vàng. |
| ✅ | `tv-chieeuf_veef_chim_ser_bay_ddeens_hots_lius_lo.mp3` | Chiều về, chim sẻ bay đến hót líu lo. |

### Cả bài · Khu vườn của bà

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-nhaf_baf_cos_mootj_khu_vuwownf-lrzrh.mp3` | Nhà bà có một khu vườn nhỏ. Trong vườn có cây cam, cây bưởi và luống rau xanh. Mỗi sáng, bà ra vườn tưới nước. Bé thích theo bà nhặt lá vàng. Chiều về, chim sẻ bay đến hót líu lo. |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddocj_ddoanj_vawn_veef_mootj_ngayf_muwa_nhes.mp3` | Đọc đoạn văn về một ngày mưa nhé. |

### Câu hỏi đọc hiểu · Trời mưa

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-khi_muwa_ddeens_ddanf_kieens_lamf_gif.mp3` | Khi mưa đến, đàn kiến làm gì? |
| ✅ | `tv-muwa_tanhj_thif_cos_gif_hieenj_ra.mp3` | Mưa tạnh thì có gì hiện ra? |

### Bài đọc · Trời mưa

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-trowif_boongx_toois_saamf_laij.mp3` | Trời bỗng tối sầm lại. |
| ✅ | `tv-gios_thooir_manhj_maay_dden_keos_ddeens.mp3` | Gió thổi mạnh, mây đen kéo đến. |
| ✅ | `tv-rooif_muwa_rowi_loopj_ddoopj_treen_mais_nhaf.mp3` | Rồi mưa rơi lộp độp trên mái nhà. |
| ✅ | `tv-ddanf_kieens_vooij_vangf_chayj_veef_toor.mp3` | Đàn kiến vội vàng chạy về tổ. |
| ✅ | `tv-muwa_tanhj_caauf_voongf_hieenj_ra_thaatj_ddepj.mp3` | Mưa tạnh, cầu vồng hiện ra thật đẹp. |

### Cả bài · Trời mưa

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-trowif_boongx_toois_saamf_laij_gios-182nj.mp3` | Trời bỗng tối sầm lại. Gió thổi mạnh, mây đen kéo đến. Rồi mưa rơi lộp độp trên mái nhà. Đàn kiến vội vàng chạy về tổ. Mưa tạnh, cầu vồng hiện ra thật đẹp. |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-thow_cos_vaanf_ddocj_leen_nghe-39hsc.mp3` | Thơ có vần, đọc lên nghe như hát. Mỗi dòng thơ nghỉ một chút nhé. |

### Câu hỏi đọc hiểu · Mèo con rửa mặt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-meof_con_ruwar_mawtj_bawngf_gif.mp3` | Mèo con rửa mặt bằng gì? |

### Bài đọc · Mèo con rửa mặt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-meof_con_daayj_sowms.mp3` | Mèo con dậy sớm, |
| ✅ | `tv-ruwar_mawtj_bawngf_tay.mp3` | Rửa mặt bằng tay. |
| ✅ | `tv-lieems_loong_sachj_bongs.mp3` | Liếm lông sạch bóng, |
| ✅ | `tv-chaof_nawngs_ban_mai.mp3` | Chào nắng ban mai. |

### Cả bài · Mèo con rửa mặt

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-meof_con_daayj_sowms_ruwar_mawtj-abt72.mp3` | Mèo con dậy sớm, / Rửa mặt bằng tay. / Liếm lông sạch bóng, / Chào nắng ban mai. |
| ✅ | `tv-meof_con_daayj_sowms_ruwar_mawtj-tmxen.mp3` | Mèo con dậy sớm, Rửa mặt bằng tay. Liếm lông sạch bóng, Chào nắng ban mai. |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-mootj_baif_thow_nhor_veef_oong_trawng.mp3` | Một bài thơ nhỏ về ông trăng. |

### Câu hỏi đọc hiểu · Ông trăng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oong_trawng_tronf_nhuw_cais_gif.mp3` | Ông trăng tròn như cái gì? |
| ✅ | `tv-trawng_soi_gif_duwowis_ao.mp3` | Trăng soi gì dưới ao? |

### Bài đọc · Ông trăng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oong_trawng_tronf_nhuw_ddiax.mp3` | Ông trăng tròn như đĩa, |
| ✅ | `tv-treo_luwngr_giuwax_trowif_cao.mp3` | Treo lửng giữa trời cao. |
| ✅ | `tv-soi_saan_nhaf_bes_ngur.mp3` | Soi sân nhà bé ngủ, |
| ✅ | `tv-soi_car_ddanf_cas_ao.mp3` | Soi cả đàn cá ao. |

### Cả bài · Ông trăng

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-oong_trawng_tronf_nhuw_ddiax_treo-1jt4x.mp3` | Ông trăng tròn như đĩa, / Treo lửng giữa trời cao. / Soi sân nhà bé ngủ, / Soi cả đàn cá ao. |
| ✅ | `tv-oong_trawng_tronf_nhuw_ddiax_treo-1x4ak.mp3` | Ông trăng tròn như đĩa, Treo lửng giữa trời cao. Soi sân nhà bé ngủ, Soi cả đàn cá ao. |

### Lời Mochi mở bài

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-ddocj_thow_veef_ddooi_banf_tay_chawm_chir.mp3` | Đọc thơ về đôi bàn tay chăm chỉ. |

### Câu hỏi đọc hiểu · Bàn tay em

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-banf_tay_em_bieets_lamf_gif.mp3` | Bàn tay em biết làm gì? |

### Bài đọc · Bàn tay em

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-banf_tay_cuar_em.mp3` | Bàn tay của em, |
| ✅ | `tv-bieets_caamf_buts_vieets.mp3` | Biết cầm bút viết. |
| ✅ | `tv-bieets_quets_saan_nhaf.mp3` | Biết quét sân nhà, |
| ✅ | `tv-bieets_oom_baf_mej.mp3` | Biết ôm bà mẹ. |

### Cả bài · Bàn tay em

| | File | Lời đọc |
|---|---|---|
| ✅ | `tv-banf_tay_cuar_em_bieets_caamf-tcj5y.mp3` | Bàn tay của em, / Biết cầm bút viết. / Biết quét sân nhà, / Biết ôm bà mẹ. |
| ✅ | `tv-banf_tay_cuar_em_bieets_caamf-11aia.mp3` | Bàn tay của em, Biết cầm bút viết. Biết quét sân nhà, Biết ôm bà mẹ. |
