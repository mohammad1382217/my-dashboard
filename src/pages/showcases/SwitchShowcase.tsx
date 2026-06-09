import { useState } from 'react'
import { Switch } from '../../components/ui/Switch/Switch'
import { useLang } from '../../i18n'

const STRINGS = {
  fa: {
    controlledHeading: 'کنترل‌شده',
    controlledStateOn: 'روشن',
    controlledStateOff: 'خاموش',
    notificationsLabel: 'فعال‌سازی اعلان‌ها',
    notificationsHelper: 'درباره‌ی فعالیت‌های مهم حساب کاربری به شما اطلاع می‌دهیم.',
    turnOn: 'روشن کن',
    turnOff: 'خاموش کن',

    uncontrolledHeading: 'بدون کنترل و حالت‌ها',
    marketingEmails: 'ایمیل‌های تبلیغاتی',
    publicProfile: 'نمایش عمومی پروفایل',
    twoFactor: 'احراز هویت دومرحله‌ای',
    twoFactorError: 'این مورد برای حساب‌های مدیر الزامی است.',
    betaFeatures: 'امکانات آزمایشی (غیرفعال)',
    lockedOn: 'قفل‌شده روی روشن (غیرفعال)',

    sizesHeading: 'اندازه‌ها',
    sizeSmall: 'کوچک',
    sizeMedium: 'متوسط',
    sizeLarge: 'بزرگ',

    labelPositionHeading: 'موقعیت برچسب و جای نشانه‌ی دستگیره',
    labelBeforeTrack: 'برچسب پیش از مسیر کلید',
    enterToggles: 'کلید Enter هم تغییر وضعیت می‌دهد (همانند دکمه)',

    nativeFormHeading: 'ارسال فرم بومی',
    airplaneMode: 'حالت پرواز',
    submit: 'ارسال',
    alertOff: '(خاموش)',
  },
  en: {
    controlledHeading: 'Controlled',
    controlledStateOn: 'on',
    controlledStateOff: 'off',
    notificationsLabel: 'Enable notifications',
    notificationsHelper: "We'll ping you about important account activity.",
    turnOn: 'Turn on',
    turnOff: 'Turn off',

    uncontrolledHeading: 'Uncontrolled & states',
    marketingEmails: 'Marketing emails',
    publicProfile: 'Public profile',
    twoFactor: 'Two-factor auth',
    twoFactorError: 'This is required for admin accounts.',
    betaFeatures: 'Beta features (disabled)',
    lockedOn: 'Locked on (disabled)',

    sizesHeading: 'Sizes',
    sizeSmall: 'Small',
    sizeMedium: 'Medium',
    sizeLarge: 'Large',

    labelPositionHeading: 'Label position & thumb slot',
    labelBeforeTrack: 'Label before the track',
    enterToggles: 'Enter also toggles (button parity)',

    nativeFormHeading: 'Native form submission',
    airplaneMode: 'Airplane mode',
    submit: 'Submit',
    alertOff: '(off)',
  },
} as const

/** Live gallery of the Switch states, rendered inside the dashboard preview panel. */
export function SwitchShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  // onCheckedChange hands you the next boolean, so the setter can be passed
  // straight through — `onCheckedChange={setNotifications}`.
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="grid gap-8">
      {/* Controlled — value-first API (onCheckedChange is the primary surface) */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">
          {t.controlledHeading} (
          {t.notificationsLabel}:{' '}
          {notifications ? t.controlledStateOn : t.controlledStateOff})
        </span>
        <Switch
          label={t.notificationsLabel}
          helperText={t.notificationsHelper}
          checked={notifications}
          onCheckedChange={setNotifications}
        />
        <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
          <button
            type="button"
            className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
            onClick={() => setNotifications(true)}
          >
            {t.turnOn}
          </button>
          <button
            type="button"
            className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
            onClick={() => setNotifications(false)}
          >
            {t.turnOff}
          </button>
        </div>
      </div>

      {/* Uncontrolled + states */}
      <div className="grid gap-4">
        <span className="text-xs font-medium text-neutral-400">{t.uncontrolledHeading}</span>
        <Switch label={t.marketingEmails} defaultChecked />
        <Switch label={t.publicProfile} />
        <Switch label={t.twoFactor} required error={t.twoFactorError} />
        <Switch label={t.betaFeatures} disabled />
        <Switch label={t.lockedOn} disabled defaultChecked />
      </div>

      {/* Sizes */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.sizesHeading}</span>
        <Switch size="sm" label={t.sizeSmall} defaultChecked />
        <Switch size="md" label={t.sizeMedium} defaultChecked />
        <Switch size="lg" label={t.sizeLarge} defaultChecked />
      </div>

      {/* Polish: label-at-start, a thumb glyph slot, opt-in Enter parity */}
      <div className="grid gap-4">
        <span className="text-xs font-medium text-neutral-400">{t.labelPositionHeading}</span>
        <Switch
          size="lg"
          label={t.labelBeforeTrack}
          labelPosition="start"
          defaultChecked
          thumbContent={<span aria-hidden="true">✓</span>}
        />
        <Switch label={t.enterToggles} toggleOnEnter />
      </div>

      {/* Native form submission — the real checkbox serializes directly */}
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.nativeFormHeading}</span>
        <form
          className="flex items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            window.alert(`airplane=${data.get('airplane') ?? t.alertOff}`)
          }}
        >
          <Switch name="airplane" value="on" label={t.airplaneMode} />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  )
}