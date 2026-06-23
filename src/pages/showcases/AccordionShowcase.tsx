import { useState } from 'react'
import { Accordion } from '../../components/ui/Accordion/Accordion'
import type { AccordionItem } from '../../components/ui/Accordion/Accordion'
import { useLang } from '../../i18n'

const STRINGS = {
  fa: {
    faqWhatTitle: 'این کتابخانه کامپوننت چیست؟',
    faqWhatContent:
      'مجموعه‌ای کوچک و داخلی از کامپوننت‌های دسترس‌پذیر — Input، Textarea، Button، Select و حالا Accordion — که با Tailwind و هماهنگ با ظاهر داشبورد استایل‌دهی شده‌اند.',
    faqWhyTitle: 'چرا سربرگ‌ها دکمه‌ی بومی هستند؟',
    faqWhyContent:
      'یک دکمه‌ی واقعی درون عنوان، فعال‌سازی با Enter/Space، مدیریت فوکوس و حالت غیرفعال را به‌رایگان در اختیار ما می‌گذارد؛ پس سیم‌کشی ARIA و کلیدهای جهت‌دار چرخشی را روی آن می‌افزاییم و در عین حال ساختار عنوانِ آکوردئونِ WAI-ARIA را حفظ می‌کنیم.',
    faqHowTitle: 'چطور انیمیشن با مرورگرهای قدیمی سازگار می‌ماند؟',
    faqHowContent:
      'پنل، یک max-height محاسبه‌شده با JS (خوانده‌شده از scrollHeight) را به‌همراه شفافیت متحرک می‌کند و فلش از transform:rotate() صریح استفاده می‌کند — هر دو برخلاف grid-template-rows، height:auto یا ویژگی مدرن rotate، به‌خوبی تا Chrome 49 / Android 5 پایین می‌آیند.',

    multiFirstTitle: 'بخش نخست',
    multiFirstContent: 'چند پنل می‌توانند هم‌زمان باز باشند.',
    multiSecondTitle: 'بخش دوم',
    multiSecondContent: 'هر کدام مستقل از بقیه باز و بسته می‌شوند.',
    multiDisabledTitle: 'بخش غیرفعال',
    multiDisabledContent: 'نباید بتوانید این یکی را باز کنید.',

    pinnedOneTitle: 'همیشه یکی باز',
    pinnedOneContent: 'کلیک دوباره روی سربرگِ باز، آن را باز نگه می‌دارد.',
    pinnedTwoTitle: 'به من سوئیچ کن',
    pinnedTwoContent: 'باز کردن مورد دیگر، مورد قبلی را می‌بندد.',

    feeShippingTitle: 'ارسال',
    feeShippingContent: 'ارسال ظرف ۲ تا ۳ روز کاری، با کد رهگیری.',
    feeReturnsTitle: 'مرجوعی',
    feeReturnsContent: 'مرجوعی رایگان تا ۳۰ روز پس از تحویل.',

    plainNoteTitle: 'بدون فلش، سطح عنوان سفارشی',
    plainNoteContent:
      'این آکوردئون فلش داخلی را پنهان می‌کند (hideChevron) و هر تریگر را در یک <h4> می‌پیچد تا با ساختار عمیق‌ترِ سند جور دربیاید.',
    plainLongTitle: 'با محتوای خود رشد می‌کند',
    plainLongContent:
      'پس از آرام‌گرفتنِ انیمیشنِ باز شدن، پنل سقف ارتفاعش را به‌کلی رها می‌کند؛ بنابراین حتی محتوایی که بازچینش می‌شود یا به‌صورت ناهم‌زمان بارگذاری می‌گردد، هرگز با سقف ثابت بریده نمی‌شود.',

    secSingleUncontrolled: 'تکی · جمع‌شونده (بدون کنترل)',
    secMultiple: 'چندتایی · با یک ردیف غیرفعال',
    secSingleNotCollapsible: 'تکی · غیرجمع‌شونده (همیشه یکی باز)',
    secNoChevron: 'بدون فلش · سطح عنوان h4',
    secControlledPrefix: 'کنترل‌شده (باز:',
    secControlledSuffix: ')',
    controlledNone: 'هیچ‌کدام',
    openShipping: 'باز کردن ارسال',
    openReturns: 'باز کردن مرجوعی',
    closeAll: 'بستن همه',
  },
  en: {
    faqWhatTitle: 'What is this component library?',
    faqWhatContent:
      'A small, in-house set of accessible components — Input, Textarea, Button, Select and now Accordion — styled with Tailwind to match the dashboard.',
    faqWhyTitle: 'Why headers as native buttons?',
    faqWhyContent:
      'A real button inside a heading gives us Enter/Space activation, focus handling and the disabled state for free, so we layer ARIA wiring and roving arrow keys on top while keeping the WAI-ARIA accordion heading structure.',
    faqHowTitle: 'How does the animation stay legacy-safe?',
    faqHowContent:
      'The panel animates a JS-measured max-height (read from scrollHeight) plus opacity, and the chevron uses an explicit transform:rotate() — both downlevel cleanly to Chrome 49 / Android 5, unlike grid-template-rows, height:auto, or the modern rotate property.',

    multiFirstTitle: 'First section',
    multiFirstContent: 'Multiple panels can be open at the same time.',
    multiSecondTitle: 'Second section',
    multiSecondContent: 'Each toggles independently of the others.',
    multiDisabledTitle: 'Disabled section',
    multiDisabledContent: 'You should not be able to open this one.',

    pinnedOneTitle: 'Always one open',
    pinnedOneContent: 'Clicking the open header again keeps it open.',
    pinnedTwoTitle: 'Switch to me',
    pinnedTwoContent: 'Opening another item closes the previous one.',

    feeShippingTitle: 'Shipping',
    feeShippingContent: 'Ships in 2–3 business days, tracked.',
    feeReturnsTitle: 'Returns',
    feeReturnsContent: 'Free returns within 30 days of delivery.',

    plainNoteTitle: 'No chevron, custom heading level',
    plainNoteContent:
      'This accordion hides the built-in chevron (hideChevron) and wraps each trigger in an <h4> so it fits a deeper document outline.',
    plainLongTitle: 'Grows with its content',
    plainLongContent:
      'After the open tween settles the panel releases its height cap entirely, so even content that reflows or loads asynchronously is never clipped by a fixed ceiling.',

    secSingleUncontrolled: 'Single · collapsible (uncontrolled)',
    secMultiple: 'Multiple · with a disabled row',
    secSingleNotCollapsible: 'Single · not collapsible (one always open)',
    secNoChevron: 'No chevron · headingLevel h4',
    secControlledPrefix: 'Controlled (open:',
    secControlledSuffix: ')',
    controlledNone: 'none',
    openShipping: 'Open shipping',
    openReturns: 'Open returns',
    closeAll: 'Close all',
  },
} as const

/** Live gallery of the Accordion modes, rendered inside the dashboard preview panel. */
export function AccordionShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [open, setOpen] = useState<string | null>('shipping')

  const FAQ_ITEMS: AccordionItem[] = [
    { id: 'what', title: t.faqWhatTitle, content: t.faqWhatContent },
    { id: 'why', title: t.faqWhyTitle, content: t.faqWhyContent },
    { id: 'how', title: t.faqHowTitle, content: t.faqHowContent },
  ]

  const MULTI_ITEMS: AccordionItem[] = [
    { id: 'a', title: t.multiFirstTitle, content: t.multiFirstContent },
    { id: 'b', title: t.multiSecondTitle, content: t.multiSecondContent },
    {
      id: 'c',
      title: t.multiDisabledTitle,
      content: t.multiDisabledContent,
      disabled: true,
    },
  ]

  const PINNED_ITEMS: AccordionItem[] = [
    { id: 'one', title: t.pinnedOneTitle, content: t.pinnedOneContent },
    { id: 'two', title: t.pinnedTwoTitle, content: t.pinnedTwoContent },
  ]

  const FEE_ITEMS: AccordionItem[] = [
    { id: 'shipping', title: t.feeShippingTitle, content: t.feeShippingContent },
    { id: 'returns', title: t.feeReturnsTitle, content: t.feeReturnsContent },
  ]

  const PLAIN_ITEMS: AccordionItem[] = [
    { id: 'note', title: t.plainNoteTitle, content: t.plainNoteContent },
    { id: 'long', title: t.plainLongTitle, content: t.plainLongContent },
  ]

  return (
    // DEFINITE width: the live-preview frame centers content, so its grid column is an
    // `auto` (content-sized) track. A percentage width (w-full/max-w-*) would resolve against
    // that content-sized track and still jitter as panels open/close — only a fixed width
    // pins the column, keeping the accordion's width constant across toggles.
    <div className="grid w-64 gap-8 sm:w-96">
      {/* Single, collapsible (uncontrolled) */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.secSingleUncontrolled}</span>
        <Accordion type="single" defaultOpen="what" items={FAQ_ITEMS} />
      </div>

      {/* Multiple */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.secMultiple}</span>
        <Accordion type="multiple" defaultOpen={['a', 'b']} items={MULTI_ITEMS} />
      </div>

      {/* Single, NOT collapsible */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.secSingleNotCollapsible}</span>
        <Accordion type="single" collapsible={false} defaultOpen="one" items={PINNED_ITEMS} />
      </div>

      {/* hideChevron + headingLevel */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.secNoChevron}</span>
        <Accordion type="multiple" headingLevel="h4" hideChevron items={PLAIN_ITEMS} />
      </div>

      {/* Controlled */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">
          {t.secControlledPrefix} {open ?? t.controlledNone}
          {t.secControlledSuffix}
        </span>
        <Accordion type="single" open={open} onOpenChange={setOpen} items={FEE_ITEMS} />
        <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
          <button
            type="button"
            className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
            onClick={() => setOpen('shipping')}
          >
            {t.openShipping}
          </button>
          <button
            type="button"
            className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
            onClick={() => setOpen('returns')}
          >
            {t.openReturns}
          </button>
          <button
            type="button"
            className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
            onClick={() => setOpen(null)}
          >
            {t.closeAll}
          </button>
        </div>
      </div>
    </div>
  )
}
