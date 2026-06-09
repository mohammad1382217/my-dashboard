import { useState } from 'react'
import { useLang } from '../../i18n'
import { RadioGroup } from '../../components/ui/RadioGroup/RadioGroup'
import type { RadioOption } from '../../components/ui/RadioGroup/RadioGroup'

const STRINGS = {
  fa: {
    controlledLabel: 'کنترل‌شده (انتخاب‌شده: ',
    controlledLabelEnd: ')',
    planLabel: 'پلن صورت‌حساب',
    planHelper: 'هر زمان بخواهید می‌توانید از تنظیمات تغییرش دهید.',
    planFree: 'رایگان',
    planFreeDesc: 'برای پروژه‌های تفریحی و آزمایشی.',
    planPro: 'حرفه‌ای',
    planProDesc: 'برای افرادی که محصول را به محیط واقعی می‌رسانند.',
    planTeam: 'تیمی',
    planTeamDesc: 'برای تیم‌هایی که با هم کار می‌کنند.',

    uncontrolledLabel: 'بدون کنترل (مقدار پیش‌فرض)',
    notificationsLabel: 'اعلان‌ها',
    notifRealtime: 'لحظه‌ای',
    notifWeekly: 'خلاصهٔ هفتگی',
    notifNever: 'هرگز',

    horizontalLabel: 'چیدمان افقی',
    sizeLabel: 'اندازه',
    sizeSmall: 'کوچک',
    sizeMedium: 'متوسط',
    sizeLarge: 'بزرگ',

    requiredErrorLabel: 'الزامی · خطا',
    shippingLabel: 'سرعت ارسال',
    shippingError: 'لطفاً یک سرعت ارسال انتخاب کنید.',
    shipStandard: 'عادی',
    shipExpress: 'سریع',
    shipOvernight: 'یک‌شبه',

    disabledGroupLabel: 'گروه غیرفعال',
    themeLabel: 'پوسته',
    themeLight: 'روشن',
    themeDark: 'تیره',
    themeSystem: 'سیستم',

    sizesLabel: 'اندازه‌ها',
    smallLabel: 'کوچک',
    largeLabel: 'بزرگ',

    nativeFormLabel: 'ارسال فرم بومی',
    contactLabel: 'راه تماس ترجیحی',
    contactEmail: 'ایمیل',
    contactPhone: 'تلفن',
    contactSms: 'پیامک',
    submit: 'ثبت',
    none: '(هیچ‌کدام)',
  },
  en: {
    controlledLabel: 'Controlled (selected: ',
    controlledLabelEnd: ')',
    planLabel: 'Billing plan',
    planHelper: 'Switch anytime from settings.',
    planFree: 'Free',
    planFreeDesc: 'For hobby projects and trials.',
    planPro: 'Pro',
    planProDesc: 'For individuals shipping to production.',
    planTeam: 'Team',
    planTeamDesc: 'For collaborating squads.',

    uncontrolledLabel: 'Uncontrolled (defaultValue)',
    notificationsLabel: 'Notifications',
    notifRealtime: 'Real-time',
    notifWeekly: 'Weekly digest',
    notifNever: 'Never',

    horizontalLabel: 'Horizontal orientation',
    sizeLabel: 'Size',
    sizeSmall: 'Small',
    sizeMedium: 'Medium',
    sizeLarge: 'Large',

    requiredErrorLabel: 'Required · error',
    shippingLabel: 'Shipping speed',
    shippingError: 'Please choose a shipping speed.',
    shipStandard: 'Standard',
    shipExpress: 'Express',
    shipOvernight: 'Overnight',

    disabledGroupLabel: 'Disabled group',
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',

    sizesLabel: 'Sizes',
    smallLabel: 'Small',
    largeLabel: 'Large',

    nativeFormLabel: 'Native form submission',
    contactLabel: 'Preferred contact',
    contactEmail: 'Email',
    contactPhone: 'Phone',
    contactSms: 'SMS',
    submit: 'Submit',
    none: '(none)',
  },
} as const

/** Live gallery of the RadioGroup states, rendered inside the dashboard preview panel. */
export function RadioGroupShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [plan, setPlan] = useState('pro')

  const planOptions: RadioOption[] = [
    { value: 'free', label: t.planFree, description: t.planFreeDesc },
    { value: 'pro', label: t.planPro, description: t.planProDesc },
    { value: 'team', label: t.planTeam, description: t.planTeamDesc },
  ]

  const sizeOptions: RadioOption[] = [
    { value: 'sm', label: t.sizeSmall },
    { value: 'md', label: t.sizeMedium },
    { value: 'lg', label: t.sizeLarge },
  ]

  return (
    <div className="grid gap-8">
      {/* Controlled, with per-option descriptions */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">
          {t.controlledLabel}
          {plan}
          {t.controlledLabelEnd}
        </span>
        <RadioGroup
          label={t.planLabel}
          helperText={t.planHelper}
          options={planOptions}
          value={plan}
          onValueChange={setPlan}
        />
      </div>

      {/* Uncontrolled with defaultValue */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.uncontrolledLabel}</span>
        <RadioGroup
          label={t.notificationsLabel}
          defaultValue="weekly"
          options={[
            { value: 'realtime', label: t.notifRealtime },
            { value: 'weekly', label: t.notifWeekly },
            { value: 'never', label: t.notifNever },
          ]}
        />
      </div>

      {/* Horizontal orientation */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.horizontalLabel}</span>
        <RadioGroup label={t.sizeLabel} orientation="horizontal" defaultValue="md" options={sizeOptions} />
      </div>

      {/* Required · error, with a per-option disabled entry */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.requiredErrorLabel}</span>
        <RadioGroup
          label={t.shippingLabel}
          required
          error={t.shippingError}
          options={[
            { value: 'standard', label: t.shipStandard },
            { value: 'express', label: t.shipExpress },
            { value: 'overnight', label: t.shipOvernight, disabled: true },
          ]}
        />
      </div>

      {/* Disabled whole group */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.disabledGroupLabel}</span>
        <RadioGroup
          label={t.themeLabel}
          disabled
          defaultValue="system"
          options={[
            { value: 'light', label: t.themeLight },
            { value: 'dark', label: t.themeDark },
            { value: 'system', label: t.themeSystem },
          ]}
        />
      </div>

      {/* Sizes */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.sizesLabel}</span>
        <RadioGroup label={t.smallLabel} size="sm" orientation="horizontal" defaultValue="md" options={sizeOptions} />
        <RadioGroup label={t.largeLabel} size="lg" orientation="horizontal" defaultValue="md" options={sizeOptions} />
      </div>

      {/* Native form submission — radios share a name and submit value */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.nativeFormLabel}</span>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            window.alert(`contact=${data.get('contact') ?? t.none}`)
          }}
        >
          <RadioGroup
            label={t.contactLabel}
            name="contact"
            defaultValue="email"
            options={[
              { value: 'email', label: t.contactEmail },
              { value: 'phone', label: t.contactPhone },
              { value: 'sms', label: t.contactSms },
            ]}
          />
          <button
            type="submit"
            className="w-fit rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
