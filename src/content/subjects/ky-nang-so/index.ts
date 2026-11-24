import type { Subject, Unit } from "@/content/types";
import { buildLesson, type DigitalLesson, type Verdict } from "./builder";
import { NHI } from "./nhi";
import { THAM_HIEM } from "./tham-hiem";
import { TINH_TAO } from "./tinh-tao";
import { CONG_DAN } from "./cong-dan";

const unit = (id: string, title: string, cover: string, list: DigitalLesson[]): Unit[] => [{ id, title, lessons: list.map((l) => buildLesson(l, cover)) }];

export const kyNangSo: Subject = {
  id: "ky-nang-so",
  name: "Kỹ năng số",
  levelsLabel: "Lớp 1 → 12",
  tagline: "Tỉnh táo trước lừa đảo, tin giả, giữ an toàn trên mạng",
  emoji: "🛡️",
  color: "#22b98c",
  cover: "subject-kns-cover",
  modes: [
    { id: "that-hay-gia", name: "Thật hay giả", short: "60 giây soi tin, đúng liền tay", emoji: "⚡", href: "/ky-nang-so/that-hay-gia", icon: "kns-mode-truefalse" },
    { id: "mat-khau", name: "Phòng thử mật khẩu", short: "Máy dò ra mật khẩu trong bao lâu?", emoji: "🔐", href: "/ky-nang-so/mat-khau", icon: "kns-mode-password" },
  ],
  look: { map: "bg-kns-map" },
  tiers: [
    { id: "nhi", name: "An toàn nhí", short: "Người lạ, mật khẩu, hỏi bố mẹ trước khi bấm", emoji: "🐣", icon: "kns-tier-1", units: unit("kns-u-nhi", "An toàn nhí", "kns-cover-nhi", NHI), challenge: { count: 10, pass: 8 } },
    { id: "tham-hiem", name: "Thám hiểm mạng", short: "Mật khẩu mạnh, trúng thưởng, link lạ, game", emoji: "🧭", icon: "kns-tier-2", units: unit("kns-u-tham-hiem", "Thám hiểm mạng", "kns-cover-tham-hiem", THAM_HIEM), challenge: { count: 10, pass: 8 } },
    { id: "tinh-tao", name: "Tỉnh táo", short: "Tin giả, kiểm chứng, bắt nạt mạng, OTP", emoji: "🔍", icon: "kns-tier-3", units: unit("kns-u-tinh-tao", "Tỉnh táo", "kns-cover-tinh-tao", TINH_TAO), challenge: { count: 10, pass: 8 } },
    { id: "cong-dan", name: "Công dân số", short: "Deepfake, lừa việc làm, dấu chân số, AI", emoji: "🌐", icon: "kns-tier-4", units: unit("kns-u-cong-dan", "Công dân số", "kns-cover-cong-dan", CONG_DAN) },
  ],
  ready: true,
  stage: "all",
};

/** kho tin "an toàn hay không ổn" theo bài, cho trò Thật hay giả */
export const VERDICTS: { lessonId: string; tier: number; v: Verdict }[] = [NHI, THAM_HIEM, TINH_TAO, CONG_DAN].flatMap((list, tier) => list.flatMap((l) => l.verdicts.map((v) => ({ lessonId: l.id, tier, v }))));
