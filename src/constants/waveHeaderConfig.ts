import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

// آخر جزء من الصورة (فيه الـ wave) هو اللي هيفضل ظاهر
export const FINAL_HEADER_HEIGHT = height * 0.25;

export const FINAL_LOGO_SIZE = width * 0.27;

// نفس القيمة مستخدمة في السبلاش وشاشة تسجيل الدخول عشان اللوجو يفضل في نفس المكان بالظبط
export const FINAL_LOGO_MARGIN_TOP = 70;

// نسبة أبعاد صورة السبلاش الأصلية (838 × 1877) عشان نعرضها من غير تشويه
export const WAVE_IMAGE_ASPECT_RATIO = 1877 / 838;
export const WAVE_IMAGE = require('../../assets/images/splash-screen.png');

// نسبة أبعاد الصورة الجديدة (layered) — نفس أبعاد السبلاش (838 × 1877)
export const LAYERED_WAVE_IMAGE_ASPECT_RATIO = 1877 / 838;
export const LAYERED_WAVE_IMAGE = require('../../assets/images/layered-splash-screen.jpeg');