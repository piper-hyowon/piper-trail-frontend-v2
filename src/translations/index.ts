import {layoutTranslations} from './layout';
import {dolphinTranslations} from './dolphin';
import {projectsTranslations} from './projects';
import {commonTranslations} from './common';
import {postcardTranslations} from "./postcard.ts";
import {postTranslations} from "./post.ts";
import {commentTranslations} from "./comment.ts";
import {seriesTranslations} from "./series.ts";

export const translations = {
        en: {
            ...layoutTranslations.en,
            ...dolphinTranslations.en,
            ...projectsTranslations.en,
            ...commonTranslations.en,
            ...postcardTranslations.en,
            ...postTranslations.en,
            ...commentTranslations.en,
            ...seriesTranslations.en,
        },
        ko: {
            ...layoutTranslations.ko,
            ...dolphinTranslations.ko,
            ...projectsTranslations.ko,
            ...commonTranslations.ko,
            ...postcardTranslations.ko,
            ...postTranslations.ko,
            ...commentTranslations.ko,
            ...seriesTranslations.ko
        }
    }
;

type DeepKeys<T> = T extends object
    ? {
        [K in keyof T]: K extends string
            ? T[K] extends object
                ? `${K}.${DeepKeys<T[K]>}`
                : K
            : never;
    }[keyof T]
    : never;

export type TranslationKey = DeepKeys<typeof translations.ko>;