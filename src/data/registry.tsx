import type { ReactNode } from 'react'
import type { Lang } from '../i18n'
import { InputShowcase } from '../pages/showcases/InputShowcase'
import { TextareaShowcase } from '../pages/showcases/TextareaShowcase'
import { ButtonShowcase } from '../pages/showcases/ButtonShowcase'
import { SelectShowcase } from '../pages/showcases/SelectShowcase'
import { AccordionShowcase } from '../pages/showcases/AccordionShowcase'
import { SwitchShowcase } from '../pages/showcases/SwitchShowcase'
import { RadioGroupShowcase } from '../pages/showcases/RadioGroupShowcase'
import { FormShowcase } from '../pages/showcases/FormShowcase'
import { InputOTPShowcase } from '../pages/showcases/InputOTPShowcase'
import { TabsShowcase } from '../pages/showcases/TabsShowcase'
import { CheckboxShowcase } from '../pages/showcases/CheckboxShowcase'
import { BadgeShowcase } from '../pages/showcases/BadgeShowcase'
import { DialogShowcase } from '../pages/showcases/DialogShowcase'
import { DatePickerJalaliShowcase } from '../pages/showcases/DatePickerJalaliShowcase'
import { ToastShowcase } from '../pages/showcases/ToastShowcase'
import { CardShowcase } from '../pages/showcases/CardShowcase'
import { CarouselShowcase } from '../pages/showcases/CarouselShowcase'
import { BottomSheetShowcase } from '../pages/showcases/BottomSheetShowcase'
import { SkeletonShowcase } from '../pages/showcases/SkeletonShowcase'
import { AvatarShowcase } from '../pages/showcases/AvatarShowcase'
import { ProgressShowcase } from '../pages/showcases/ProgressShowcase'
import { SliderShowcase } from '../pages/showcases/SliderShowcase'
import { TooltipShowcase } from '../pages/showcases/TooltipShowcase'
import { DropdownMenuShowcase } from '../pages/showcases/DropdownMenuShowcase'
import { SeparatorShowcase } from '../pages/showcases/SeparatorShowcase'
import { LabelShowcase } from '../pages/showcases/LabelShowcase'
import { KbdShowcase } from '../pages/showcases/KbdShowcase'
import { SpinnerShowcase } from '../pages/showcases/SpinnerShowcase'
import { AspectRatioShowcase } from '../pages/showcases/AspectRatioShowcase'
import { EmptyShowcase } from '../pages/showcases/EmptyShowcase'
import { AlertShowcase } from '../pages/showcases/AlertShowcase'
import { BreadcrumbShowcase } from '../pages/showcases/BreadcrumbShowcase'
import { ToggleShowcase } from '../pages/showcases/ToggleShowcase'
import { ToggleGroupShowcase } from '../pages/showcases/ToggleGroupShowcase'
import { ButtonGroupShowcase } from '../pages/showcases/ButtonGroupShowcase'
import { InputGroupShowcase } from '../pages/showcases/InputGroupShowcase'
import { ItemShowcase } from '../pages/showcases/ItemShowcase'
import { FieldShowcase } from '../pages/showcases/FieldShowcase'
import { PaginationShowcase } from '../pages/showcases/PaginationShowcase'
import { TableShowcase } from '../pages/showcases/TableShowcase'
import { ScrollAreaShowcase } from '../pages/showcases/ScrollAreaShowcase'
import { CollapsibleShowcase } from '../pages/showcases/CollapsibleShowcase'
import { PopoverShowcase } from '../pages/showcases/PopoverShowcase'
import { HoverCardShowcase } from '../pages/showcases/HoverCardShowcase'
import { ContextMenuShowcase } from '../pages/showcases/ContextMenuShowcase'
import { SheetShowcase } from '../pages/showcases/SheetShowcase'
import { AlertDialogShowcase } from '../pages/showcases/AlertDialogShowcase'
import { CalendarShowcase } from '../pages/showcases/CalendarShowcase'
import { ComboboxShowcase } from '../pages/showcases/ComboboxShowcase'
import { CommandShowcase } from '../pages/showcases/CommandShowcase'
import { MenubarShowcase } from '../pages/showcases/MenubarShowcase'
import { NavigationMenuShowcase } from '../pages/showcases/NavigationMenuShowcase'
import { SidebarShowcase } from '../pages/showcases/SidebarShowcase'
import { ResizableShowcase } from '../pages/showcases/ResizableShowcase'
import { DataTableShowcase } from '../pages/showcases/DataTableShowcase'
import { ChartShowcase } from '../pages/showcases/ChartShowcase'
// Raw source of each component, so the Code view can show it and the Download
// button can save the real, reusable file.
import inputSource from '../components/ui/Input/Input.tsx?raw'
import textareaSource from '../components/ui/Textarea/Textarea.tsx?raw'
import buttonSource from '../components/ui/Button/Button.tsx?raw'
import selectSource from '../components/ui/Select/Select.tsx?raw'
import accordionSource from '../components/ui/Accordion/Accordion.tsx?raw'
import switchSource from '../components/ui/Switch/Switch.tsx?raw'
import radioGroupSource from '../components/ui/RadioGroup/RadioGroup.tsx?raw'
import formSource from '../components/ui/Form/Form.tsx?raw'
import inputOtpSource from '../components/ui/InputOTP/InputOTP.tsx?raw'
import tabsSource from '../components/ui/Tabs/Tabs.tsx?raw'
import checkboxSource from '../components/ui/Checkbox/Checkbox.tsx?raw'
import badgeSource from '../components/ui/Badge/Badge.tsx?raw'
import dialogSource from '../components/ui/Dialog/Dialog.tsx?raw'
import datePickerJalaliSource from '../components/ui/DatePickerJalali/DatePickerJalali.tsx?raw'
import toastSource from '../components/ui/Toast/Toast.tsx?raw'
import cardSource from '../components/ui/Card/Card.tsx?raw'
import carouselSource from '../components/ui/Carousel/Carousel.tsx?raw'
import bottomSheetSource from '../components/ui/BottomSheet/BottomSheet.tsx?raw'
import skeletonSource from '../components/ui/Skeleton/Skeleton.tsx?raw'
import avatarSource from '../components/ui/Avatar/Avatar.tsx?raw'
import progressSource from '../components/ui/Progress/Progress.tsx?raw'
import sliderSource from '../components/ui/Slider/Slider.tsx?raw'
import tooltipSource from '../components/ui/Tooltip/Tooltip.tsx?raw'
import dropdownMenuSource from '../components/ui/DropdownMenu/DropdownMenu.tsx?raw'
import separatorSource from '../components/ui/Separator/Separator.tsx?raw'
import labelSource from '../components/ui/Label/Label.tsx?raw'
import kbdSource from '../components/ui/Kbd/Kbd.tsx?raw'
import spinnerSource from '../components/ui/Spinner/Spinner.tsx?raw'
import aspectRatioSource from '../components/ui/AspectRatio/AspectRatio.tsx?raw'
import emptySource from '../components/ui/Empty/Empty.tsx?raw'
import alertSource from '../components/ui/Alert/Alert.tsx?raw'
import breadcrumbSource from '../components/ui/Breadcrumb/Breadcrumb.tsx?raw'
import toggleSource from '../components/ui/Toggle/Toggle.tsx?raw'
import toggleGroupSource from '../components/ui/ToggleGroup/ToggleGroup.tsx?raw'
import buttonGroupSource from '../components/ui/ButtonGroup/ButtonGroup.tsx?raw'
import inputGroupSource from '../components/ui/InputGroup/InputGroup.tsx?raw'
import itemSource from '../components/ui/Item/Item.tsx?raw'
import fieldSource from '../components/ui/Field/Field.tsx?raw'
import paginationSource from '../components/ui/Pagination/Pagination.tsx?raw'
import tableSource from '../components/ui/Table/Table.tsx?raw'
import scrollAreaSource from '../components/ui/ScrollArea/ScrollArea.tsx?raw'
import collapsibleSource from '../components/ui/Collapsible/Collapsible.tsx?raw'
import popoverSource from '../components/ui/Popover/Popover.tsx?raw'
import hoverCardSource from '../components/ui/HoverCard/HoverCard.tsx?raw'
import contextMenuSource from '../components/ui/ContextMenu/ContextMenu.tsx?raw'
import sheetSource from '../components/ui/Sheet/Sheet.tsx?raw'
import alertDialogSource from '../components/ui/AlertDialog/AlertDialog.tsx?raw'
import calendarSource from '../components/ui/Calendar/Calendar.tsx?raw'
import comboboxSource from '../components/ui/Combobox/Combobox.tsx?raw'
import commandSource from '../components/ui/Command/Command.tsx?raw'
import menubarSource from '../components/ui/Menubar/Menubar.tsx?raw'
import navigationMenuSource from '../components/ui/NavigationMenu/NavigationMenu.tsx?raw'
import sidebarSource from '../components/ui/Sidebar/Sidebar.tsx?raw'
import resizableSource from '../components/ui/Resizable/Resizable.tsx?raw'
import dataTableSource from '../components/ui/DataTable/DataTable.tsx?raw'
import chartSource from '../components/ui/Chart/Chart.tsx?raw'

export type Bilingual = Record<Lang, string>

/** One categorized, copyable usage example shown in the Usage view. */
export interface UsageExample {
  /** Category heading (bilingual). */
  label: Bilingual
  /** The code snippet for this category. */
  code: string
}

/** Reusable category labels, so usage groupings stay consistent across components. */
const U = {
  basic: { fa: 'پایه', en: 'Basic' },
  variants: { fa: 'واریانت‌ها', en: 'Variants' },
  sizes: { fa: 'اندازه‌ها', en: 'Sizes' },
  controlled: { fa: 'کنترل‌شده', en: 'Controlled' },
  uncontrolled: { fa: 'بدونِ کنترل', en: 'Uncontrolled' },
  states: { fa: 'وضعیت‌ها', en: 'States' },
  disabled: { fa: 'غیرفعال', en: 'Disabled' },
  withIcon: { fa: 'با آیکون', en: 'With icon' },
  withLabel: { fa: 'با لیبل', en: 'With label' },
  error: { fa: 'خطا و اعتبارسنجی', en: 'Error / validation' },
  rtl: { fa: 'راست‌به‌چپ (RTL)', en: 'RTL' },
  keyboard: { fa: 'کیبورد', en: 'Keyboard' },
  override: { fa: 'اوررایدِ استایل', en: 'Style override' },
  data: { fa: 'داده‌محور', en: 'Data-driven' },
  async: { fa: 'ناهمگام', en: 'Async' },
  full: { fa: 'نمونهٔ کامل', en: 'Full example' },
} satisfies Record<string, Bilingual>

export interface ComponentEntry {
  id: string
  /** Latin code name (the actual component). */
  code: string
  /** Downloadable file name, e.g. "Input.tsx". */
  file: string
  /** Raw source of the component file. */
  source: string
  /** Categorized, copyable usage examples covering the component's options. */
  usage: UsageExample[]
  name: Bilingual
  description: Bilingual
  render: () => ReactNode
}

export const COMPONENTS: ComponentEntry[] = [
  {
    id: 'input',
    code: 'Input',
    file: 'Input.tsx',
    source: inputSource,
    usage: [
      { label: U.basic, code: `<Input placeholder="you@example.com" />` },
      {
        label: U.withLabel,
        code: `<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  helperText="We'll never share it."
/>`,
      },
      {
        label: U.sizes,
        code: `<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`,
      },
      {
        label: U.withIcon,
        code: `<Input label="Search" startIcon={<Icon name="search" />} placeholder="Search…" />
<Input label="Amount" endIcon={<span>$</span>} inputMode="numeric" />`,
      },
      {
        label: U.error,
        code: `<Input label="Email" defaultValue="bad" error="Enter a valid email." />
<Input label="Email" error /> {/* invalid state only, no message */}`,
      },
      {
        label: U.states,
        code: `<Input label="Disabled" disabled />
<Input label="Required" required />
<Input label="Read-only" defaultValue="Locked" readOnly />`,
      },
      { label: U.override, code: `<Input className="rounded-full border-emerald-400" />` },
    ],
    name: { fa: 'ورودی', en: 'Input' },
    description: {
      fa: 'فیلد متنی روی تگ نیتیوِ <input> با لیبل، متن راهنما و حالت خطا.',
      en: 'Text field on the native <input> with label, helper text and error state.',
    },
    render: () => <InputShowcase />,
  },
  {
    id: 'textarea',
    code: 'Textarea',
    file: 'Textarea.tsx',
    source: textareaSource,
    usage: [
      { label: U.basic, code: `<Textarea placeholder="Tell us about you…" />` },
      {
        label: U.withLabel,
        code: `<Textarea
  label="Bio"
  placeholder="Tell us about you…"
  helperText="A short description."
  rows={4}
/>`,
      },
      {
        label: U.sizes,
        code: `<Textarea size="sm" />
<Textarea size="md" />
<Textarea size="lg" />`,
      },
      { label: U.error, code: `<Textarea label="Bio" error="This field is required." />` },
      {
        label: U.states,
        code: `<Textarea label="Disabled" disabled />
<Textarea label="Required" required />`,
      },
    ],
    name: { fa: 'ناحیه متن', en: 'Textarea' },
    description: {
      fa: 'ورودی چندخطی روی تگ نیتیوِ <textarea>.',
      en: 'Multi-line field on the native <textarea>.',
    },
    render: () => <TextareaShowcase />,
  },
  {
    id: 'button',
    code: 'Button',
    file: 'Button.tsx',
    source: buttonSource,
    usage: [
      {
        label: U.variants,
        code: `<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>`,
      },
      {
        label: U.sizes,
        code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
      },
      {
        label: U.withIcon,
        code: `<Button>
  <Icon name="download" /> Download
</Button>`,
      },
      {
        label: U.states,
        code: `<Button disabled>Disabled</Button>
<Button type="submit" onClick={() => save()}>Save changes</Button>`,
      },
    ],
    name: { fa: 'دکمه', en: 'Button' },
    description: {
      fa: 'اکشن کلیک‌شدنی با واریانت، سایز و موجِ کلیک.',
      en: 'Clickable action with variants, sizes and a click ripple.',
    },
    render: () => <ButtonShowcase />,
  },
  {
    id: 'select',
    code: 'Select',
    file: 'Select.tsx',
    source: selectSource,
    usage: [
      {
        label: U.basic,
        code: `<Select defaultValue="us">
  <option value="us">United States</option>
  <option value="de">Germany</option>
</Select>`,
      },
      {
        label: U.withLabel,
        code: `<Select label="Country" placeholder="Select a country" defaultValue="" helperText="Pick one.">
  <option value="us">United States</option>
  <option value="ir">Iran</option>
</Select>`,
      },
      {
        label: U.sizes,
        code: `<Select size="sm">…</Select>
<Select size="lg">…</Select>`,
      },
      {
        label: U.error,
        code: `<Select label="Country" error="Please choose a country." defaultValue="">
  <option value="" disabled>Select…</option>
</Select>`,
      },
      { label: U.states, code: `<Select label="Disabled" disabled>…</Select>` },
    ],
    name: { fa: 'انتخابگر', en: 'Select' },
    description: {
      fa: 'منوی تک‌انتخابی روی تگ نیتیوِ <select> با فلش سفارشی.',
      en: 'Single-choice menu on the native <select> with a custom chevron.',
    },
    render: () => <SelectShowcase />,
  },
  {
    id: 'accordion',
    code: 'Accordion',
    file: 'Accordion.tsx',
    source: accordionSource,
    usage: [
      {
        label: U.basic,
        code: `<Accordion
  type="single"
  defaultOpen="a"
  items={[
    { id: 'a', title: 'Is it accessible?', content: 'Yes — it follows WAI-ARIA.' },
    { id: 'b', title: 'Is it animated?', content: 'Yes, with a legacy-safe transition.' },
  ]}
/>`,
      },
      {
        label: { fa: 'چندتایی باز', en: 'Multiple open' },
        code: `<Accordion type="multiple" defaultOpen={['a', 'b']} items={items} />`,
      },
      {
        label: U.controlled,
        code: `const [open, setOpen] = useState<string | null>('a')

<Accordion type="single" open={open} onOpenChange={setOpen} items={items} />`,
      },
      {
        label: U.states,
        code: `// Disable a single row, or hide every chevron
items={[{ id: 'a', title: 'Locked', content: '…', disabled: true }]}

<Accordion items={items} hideChevron />`,
      },
    ],
    name: { fa: 'آکاردیون', en: 'Accordion' },
    description: {
      fa: 'بخش‌های جمع‌شونده با انیمیشنِ سازگار با مرورگرهای قدیمی.',
      en: 'Collapsible sections with legacy-safe animation.',
    },
    render: () => <AccordionShowcase />,
  },
  {
    id: 'switch',
    code: 'Switch',
    file: 'Switch.tsx',
    source: switchSource,
    usage: [
      { label: U.basic, code: `<Switch label="Wi-Fi" defaultChecked />` },
      {
        label: U.controlled,
        code: `const [on, setOn] = useState(false)

<Switch label="Wi-Fi" checked={on} onCheckedChange={setOn} />`,
      },
      {
        label: U.sizes,
        code: `<Switch size="sm" />
<Switch size="md" />
<Switch size="lg" />`,
      },
      {
        label: { fa: 'جای لیبل و محتوای دستگیره', en: 'Label side & thumb content' },
        code: `<Switch label="Dark mode" labelPosition="start" thumbContent={<Icon name="moon" />} />`,
      },
      {
        label: U.states,
        code: `<Switch label="Disabled" disabled />
<Switch label="Error" error="Required" />`,
      },
      {
        label: { fa: 'در فرمِ نیتیو', en: 'In a native form' },
        code: `<Switch name="newsletter" value="yes" label="Subscribe" toggleOnEnter />`,
      },
    ],
    name: { fa: 'سوییچ', en: 'Switch' },
    description: {
      fa: 'کلیدِ روشن/خاموش روی <input type="checkbox" role="switch">.',
      en: 'On/off toggle on <input type="checkbox" role="switch">.',
    },
    render: () => <SwitchShowcase />,
  },
  {
    id: 'radio-group',
    code: 'RadioGroup',
    file: 'RadioGroup.tsx',
    source: radioGroupSource,
    usage: [
      {
        label: U.basic,
        code: `<RadioGroup
  label="Billing plan"
  defaultValue="pro"
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
  ]}
/>`,
      },
      {
        label: U.controlled,
        code: `const [plan, setPlan] = useState('pro')

<RadioGroup value={plan} onValueChange={setPlan} options={options} />`,
      },
      {
        label: { fa: 'با توضیحِ هر گزینه', en: 'Option descriptions' },
        code: `options={[
  { value: 'pro', label: 'Pro', description: '$12 / month, billed yearly' },
  { value: 'team', label: 'Team', description: 'For up to 10 people' },
]}`,
      },
      {
        label: { fa: 'چیدمان و اندازه', en: 'Layout & size' },
        code: `<RadioGroup orientation="horizontal" size="lg" options={options} />`,
      },
      {
        label: U.states,
        code: `// Disable one option, or mark the whole group invalid
options={[{ value: 'team', label: 'Team', disabled: true }]}

<RadioGroup error="Please pick a plan." options={options} />`,
      },
    ],
    name: { fa: 'گروه رادیویی', en: 'Radio Group' },
    description: {
      fa: 'گزینه‌های منحصربه‌فرد روی رادیوهای نیتیو، با پراپِ options.',
      en: 'Mutually-exclusive options on native radios, via an options array.',
    },
    render: () => <RadioGroupShowcase />,
  },
  {
    id: 'form',
    code: 'Form',
    file: 'Form.tsx',
    source: formSource,
    usage: [
      {
        label: U.basic,
        code: `<Form onSubmit={(values) => console.log(values)}>
  <Input name="email" label="Email" type="email" required />
  <Switch name="newsletter" value="yes" label="Subscribe" />
  <Button type="submit">Create account</Button>
</Form>`,
      },
      {
        label: { fa: 'خواندنِ مقادیر', en: 'Reading values' },
        code: `// onSubmit receives a plain object keyed by each field's name
<Form onSubmit={(values) => {
  console.log(values.email, values.newsletter)
}}>
  …
</Form>`,
      },
      {
        label: U.async,
        code: `<Form onSubmit={async (values) => {
  await api.signup(values)
}}>
  …
</Form>`,
      },
    ],
    name: { fa: 'فرم', en: 'Form' },
    description: {
      fa: 'wrapperِ نیتیوِ <form> که فیلدها را می‌چیند و مقادیر ارسالی را بدون boilerplate می‌دهد.',
      en: 'Native <form> wrapper that lays out fields and hands you the submitted values with no boilerplate.',
    },
    render: () => <FormShowcase />,
  },
  {
    id: 'input-otp',
    code: 'InputOTP',
    file: 'InputOTP.tsx',
    source: inputOtpSource,
    usage: [
      { label: U.basic, code: `<InputOTP length={6} />` },
      {
        label: U.controlled,
        code: `const [code, setCode] = useState('')

<InputOTP
  length={6}
  value={code}
  onChange={setCode}
  onComplete={(value) => console.log('complete', value)}
/>`,
      },
      {
        label: { fa: 'طول و خودکار-فوکوس', en: 'Length & autofocus' },
        code: `<InputOTP length={4} autoFocus />`,
      },
      {
        label: U.states,
        code: `<InputOTP label="Verification code" error="Wrong code." />
<InputOTP disabled defaultValue="123456" />`,
      },
      {
        label: { fa: 'در فرمِ نیتیو', en: 'In a native form' },
        code: `<InputOTP name="otp" label="Code" /> {/* submits the combined value */}`,
      },
    ],
    name: { fa: 'ورودی OTP', en: 'Input OTP' },
    description: {
      fa: 'ورودیِ کدِ یک‌بارمصرفِ خانه‌ای، با auto-advance و چسباندنِ کلِ کد (همیشه چپ‌به‌راست).',
      en: 'Segmented one-time-password input with auto-advance and full-code paste (always LTR).',
    },
    render: () => <InputOTPShowcase />,
  },
  {
    id: 'tabs',
    code: 'Tabs',
    file: 'Tabs.tsx',
    source: tabsSource,
    usage: [
      {
        label: U.basic,
        code: `<Tabs
  defaultValue="account"
  items={[
    { value: 'account', label: 'Account', content: <p>Account settings…</p> },
    { value: 'password', label: 'Password', content: <p>Password settings…</p> },
  ]}
/>`,
      },
      {
        label: U.variants,
        code: `<Tabs variant="underline" items={items} />
<Tabs variant="pill" items={items} />`,
      },
      {
        label: U.controlled,
        code: `const [tab, setTab] = useState('account')

<Tabs value={tab} onValueChange={setTab} items={items} />`,
      },
      {
        label: U.states,
        code: `items={[{ value: 'billing', label: 'Billing', content: …, disabled: true }]}`,
      },
    ],
    name: { fa: 'تب‌ها', en: 'Tabs' },
    description: {
      fa: 'تب‌های WAI-ARIA با ناوبریِ کیبورد، دو سبک (خط‌دار/دکمه‌ای) و indicatorِ متحرک (سازگار با RTL).',
      en: 'WAI-ARIA tabs with keyboard nav, two styles (underline/pill) and an animated indicator (RTL-aware).',
    },
    render: () => <TabsShowcase />,
  },
  {
    id: 'checkbox',
    code: 'Checkbox',
    file: 'Checkbox.tsx',
    source: checkboxSource,
    usage: [
      { label: U.basic, code: `<Checkbox label="I accept the terms" defaultChecked />` },
      {
        label: U.controlled,
        code: `const [checked, setChecked] = useState(false)

<Checkbox label="I accept the terms" checked={checked} onCheckedChange={setChecked} />`,
      },
      {
        label: { fa: 'حالتِ نامعین (mixed)', en: 'Indeterminate (mixed)' },
        code: `<Checkbox label="Select all" indeterminate />`,
      },
      {
        label: U.states,
        code: `<Checkbox label="Disabled" disabled />
<Checkbox label="Required" required error="You must accept the terms." />`,
      },
    ],
    name: { fa: 'چک‌باکس', en: 'Checkbox' },
    description: {
      fa: 'چک‌باکسِ نیتیو با حالتِ سه‌گانه (indeterminate)، لیبل، خطا و انیمیشنِ ریز.',
      en: 'Native checkbox with an indeterminate (mixed) state, label, error and a subtle animation.',
    },
    render: () => <CheckboxShowcase />,
  },
  {
    id: 'badge',
    code: 'Badge',
    file: 'Badge.tsx',
    source: badgeSource,
    usage: [
      {
        label: U.variants,
        code: `<Badge>Default</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="outline">Beta</Badge>`,
      },
      {
        label: { fa: 'با نقطهٔ وضعیت', en: 'With status dot' },
        code: `<Badge variant="success" dot>Online</Badge>`,
      },
      { label: U.override, code: `<Badge className="px-3 py-1 text-sm">Custom</Badge>` },
    ],
    name: { fa: 'بَج', en: 'Badge' },
    description: {
      fa: 'برچسبِ کوچکِ وضعیت/دسته با چند واریانتِ رنگی و نقطهٔ وضعیتِ اختیاری.',
      en: 'Small status / category label with colour variants and an optional status dot.',
    },
    render: () => <BadgeShowcase />,
  },
  {
    id: 'dialog',
    code: 'Dialog',
    file: 'Dialog.tsx',
    source: dialogSource,
    usage: [
      {
        label: U.basic,
        code: `const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open</Button>

<Dialog open={open} onOpenChange={setOpen} title="Delete account" description="This action cannot be undone.">
  <p>Are you sure?</p>
</Dialog>`,
      },
      {
        label: { fa: 'با فوتر (اکشن‌ها)', en: 'With footer actions' },
        code: `<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete account"
  footer={
    <>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={remove}>Delete</Button>
    </>
  }
>
  <p>Are you sure?</p>
</Dialog>`,
      },
      {
        label: { fa: 'تنظیماتِ بستن و اندازه', en: 'Dismissal & size options' },
        code: `<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Required step"
  closeOnOverlayClick={false}
  closeOnEscape={false}
  showCloseButton={false}
  className="max-w-md"
>
  …
</Dialog>`,
      },
    ],
    name: { fa: 'دیالوگ', en: 'Dialog' },
    description: {
      fa: 'مودالِ دسترس‌پذیر در portal، با focus trap، بستن با Escape/کلیکِ بیرون و انیمیشنِ ورود.',
      en: 'Accessible modal in a portal, with focus trap, Escape / overlay close and an entrance animation.',
    },
    render: () => <DialogShowcase />,
  },
  {
    id: 'datepicker-jalali',
    code: 'DatePickerJalali',
    file: 'DatePickerJalali.tsx',
    source: datePickerJalaliSource,
    usage: [
      {
        label: U.controlled,
        code: `const [date, setDate] = useState<Date | null>(null)

<DatePickerJalali label="تاریخ تولد" value={date} onChange={setDate} />`,
      },
      {
        label: U.uncontrolled,
        code: `<DatePickerJalali defaultValue={new Date()} placeholder="انتخاب تاریخ" />`,
      },
      {
        label: U.states,
        code: `<DatePickerJalali label="غیرفعال" disabled />
<DatePickerJalali label="تاریخ" error="تاریخ نامعتبر است" />`,
      },
    ],
    name: { fa: 'تقویم شمسی', en: 'Jalali Date Picker' },
    description: {
      fa: 'انتخابگرِ تاریخِ جلالی (شمسی) با تقویمِ RTL، ارقام فارسی و خروجیِ Date میلادی.',
      en: 'Jalali (Persian) date picker with an RTL calendar, Persian digits and a Gregorian Date output.',
    },
    render: () => <DatePickerJalaliShowcase />,
  },
  {
    id: 'toast',
    code: 'Toast',
    file: 'Toast.tsx',
    source: toastSource,
    usage: [
      {
        label: { fa: 'راه‌اندازی (Provider)', en: 'Setup (Provider)' },
        code: `// Wrap your app once near the root:
<ToastProvider position="bottom-right" duration={4000}>
  <App />
</ToastProvider>`,
      },
      {
        label: U.variants,
        code: `const toast = useToast()

toast.success('Saved!', { description: 'Your changes were saved.' })
toast.error('Could not save')
toast.warning('Storage almost full')
toast.message('Heads up') // neutral / gray`,
      },
      {
        label: { fa: 'جایگاه (۶ جهت)', en: 'Position (6 spots)' },
        code: `// top|bottom × left|center|right
<ToastProvider position="top-center">…</ToastProvider>`,
      },
      {
        label: { fa: 'بستنِ دستی', en: 'Dismiss manually' },
        code: `const id = toast.message('Uploading…')
// later:
toast.dismiss(id)`,
      },
    ],
    name: { fa: 'توست', en: 'Toast' },
    description: {
      fa: 'اعلانِ موقت با Provider و هوکِ useToast؛ انواعِ success/error/warning/خاکستری، در portal با auto-dismiss.',
      en: 'Transient notifications via a provider + useToast hook; success/error/warning/gray, portaled with auto-dismiss.',
    },
    render: () => <ToastShowcase />,
  },
  {
    id: 'card',
    code: 'Card',
    file: 'Card.tsx',
    source: cardSource,
    usage: [
      {
        label: U.basic,
        code: `<Card title="Pro plan" description="Billed monthly">
  <p>Access to every feature.</p>
</Card>`,
      },
      {
        label: { fa: 'با فوتر', en: 'With footer' },
        code: `<Card title="Pro plan" description="Billed monthly" footer={<Button>Upgrade</Button>}>
  <p>Access to every feature.</p>
</Card>`,
      },
      {
        label: { fa: 'فقط بدنه', en: 'Body only' },
        code: `<Card className="p-6">Just a styled container.</Card>`,
      },
    ],
    name: { fa: 'کارت', en: 'Card' },
    description: {
      fa: 'کانتینرِ ساده با هدر (عنوان/توضیح)، بدنه و فوتر اختیاری.',
      en: 'Simple container with optional header (title/description), body and footer.',
    },
    render: () => <CardShowcase />,
  },
  {
    id: 'carousel',
    code: 'Carousel',
    file: 'Carousel.tsx',
    source: carouselSource,
    usage: [
      {
        label: U.basic,
        code: `<Carousel
  items={[
    <img src="/1.jpg" alt="" />,
    <img src="/2.jpg" alt="" />,
  ]}
/>`,
      },
      { label: { fa: 'حلقه‌ای (loop)', en: 'Loop' }, code: `<Carousel loop items={slides} />` },
      {
        label: U.controlled,
        code: `const [index, setIndex] = useState(0)

<Carousel value={index} onValueChange={setIndex} items={slides} />`,
      },
    ],
    name: { fa: 'کاروسل', en: 'Carousel' },
    description: {
      fa: 'اسلایدرِ افقی با دکمه‌ها، نقطه‌ها، ناوبریِ کیبورد و حالتِ loop.',
      en: 'Horizontal slider with buttons, dots, keyboard navigation and a loop mode.',
    },
    render: () => <CarouselShowcase />,
  },
  {
    id: 'bottom-sheet',
    code: 'BottomSheet',
    file: 'BottomSheet.tsx',
    source: bottomSheetSource,
    usage: [
      {
        label: U.basic,
        code: `const [open, setOpen] = useState(false)
const [sort, setSort] = useState('newest')

<Button onClick={() => setOpen(true)}>Open sheet</Button>

<BottomSheet
  open={open}
  onOpenChange={setOpen}
  title="Sort by"
  description="Pick one option."
  footer={<Button onClick={() => setOpen(false)}>Apply</Button>}
>
  <RadioGroup
    value={sort}
    onValueChange={setSort}
    options={[
      { value: 'newest', label: 'Newest' },
      { value: 'cheapest', label: 'Cheapest' },
      { value: 'popular', label: 'Most popular' },
    ]}
  />
</BottomSheet>`,
      },
      {
        label: { fa: 'تنظیماتِ بستن', en: 'Dismissal options' },
        code: `<BottomSheet open={open} onOpenChange={setOpen} closeOnOverlayClick={false} closeOnEscape={false} closeLabel="بستن">
  …
</BottomSheet>`,
      },
    ],
    name: { fa: 'باتم‌شیت', en: 'Bottom Sheet' },
    description: {
      fa: 'شیتِ مودالِ کشویی از پایین در portal، با focus trap و بستن با Escape/کلیکِ بیرون.',
      en: 'Modal sheet that slides up from the bottom in a portal, with focus trap and Escape / overlay close.',
    },
    render: () => <BottomSheetShowcase />,
  },
  {
    id: 'skeleton',
    code: 'Skeleton',
    file: 'Skeleton.tsx',
    source: skeletonSource,
    usage: [
      { label: U.basic, code: `<Skeleton className="h-4 w-40" />` },
      {
        label: { fa: 'شکل‌ها', en: 'Shapes' },
        code: `<Skeleton className="size-12 rounded-full" /> {/* avatar */}
<Skeleton className="h-32 w-full rounded-xl" /> {/* image */}`,
      },
      {
        label: { fa: 'بلوکِ متن', en: 'Text block' },
        code: `<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-2/3" />
</div>`,
      },
    ],
    name: { fa: 'اسکلتون', en: 'Skeleton' },
    description: {
      fa: 'پلیس‌هولدرِ بارگذاری با انیمیشنِ pulse.',
      en: 'Loading placeholder with a pulse animation.',
    },
    render: () => <SkeletonShowcase />,
  },
  {
    id: 'avatar',
    code: 'Avatar',
    file: 'Avatar.tsx',
    source: avatarSource,
    usage: [
      { label: U.basic, code: `<Avatar src="/ada.jpg" alt="Ada Lovelace" />` },
      {
        label: { fa: 'جایگزینِ حروف‌اول', en: 'Initials fallback' },
        code: `<Avatar fallback="AL" /> {/* shown when src is missing or fails to load */}`,
      },
      {
        label: U.sizes,
        code: `<Avatar fallback="S" size="sm" />
<Avatar fallback="M" size="md" />
<Avatar fallback="L" size="lg" />`,
      },
    ],
    name: { fa: 'آواتار', en: 'Avatar' },
    description: {
      fa: 'آواتارِ دایره‌ای با عکس + جایگزینِ حروف‌اول و سایزها.',
      en: 'Circular avatar with image + initials fallback and sizes.',
    },
    render: () => <AvatarShowcase />,
  },
  {
    id: 'progress',
    code: 'Progress',
    file: 'Progress.tsx',
    source: progressSource,
    usage: [
      { label: U.basic, code: `<Progress value={66} />` },
      { label: { fa: 'با لیبل و درصد', en: 'Label & value' }, code: `<Progress value={66} max={100} label="Uploading" showValue />` },
      { label: { fa: 'سقفِ دلخواه', en: 'Custom max' }, code: `<Progress value={3} max={5} label="Step 3 of 5" />` },
    ],
    name: { fa: 'نوار پیشرفت', en: 'Progress' },
    description: {
      fa: 'نوار پیشرفتِ تعیّنی با aria و انیمیشنِ عرض.',
      en: 'Determinate progress bar with aria and an animated fill.',
    },
    render: () => <ProgressShowcase />,
  },
  {
    id: 'slider',
    code: 'Slider',
    file: 'Slider.tsx',
    source: sliderSource,
    usage: [
      { label: U.basic, code: `<Slider defaultValue={40} aria-label="Volume" />` },
      {
        label: U.controlled,
        code: `const [v, setV] = useState(40)

<Slider label="Volume" value={v} onChange={(e) => setV(Number(e.target.value))} showValue />`,
      },
      {
        label: { fa: 'بازه و گام', en: 'Range & step' },
        code: `<Slider label="Brightness" min={0} max={200} step={10} defaultValue={120} showValue />`,
      },
      { label: U.states, code: `<Slider label="Disabled" disabled defaultValue={50} />` },
    ],
    name: { fa: 'اسلایدر', en: 'Slider' },
    description: {
      fa: 'اسلایدرِ بازه روی <input type="range"> با accent-color.',
      en: 'Range slider on <input type="range"> tinted with accent-color.',
    },
    render: () => <SliderShowcase />,
  },
  {
    id: 'tooltip',
    code: 'Tooltip',
    file: 'Tooltip.tsx',
    source: tooltipSource,
    usage: [
      {
        label: U.basic,
        code: `<Tooltip content="A short hint">
  <Button>Hover me</Button>
</Tooltip>`,
      },
      {
        label: { fa: 'جهت‌ها', en: 'Sides' },
        code: `<Tooltip content="Top" side="top">…</Tooltip>
<Tooltip content="Right" side="right">…</Tooltip>
<Tooltip content="Bottom" side="bottom">…</Tooltip>
<Tooltip content="Left" side="left">…</Tooltip>`,
      },
      {
        label: { fa: 'تأخیرِ نمایش', en: 'Open delay' },
        code: `<Tooltip content="Appears slowly" delay={600}>
  <Button>Hover</Button>
</Tooltip>`,
      },
    ],
    name: { fa: 'تولتیپ', en: 'Tooltip' },
    description: {
      fa: 'تولتیپِ hover/focus با جای‌گیری، تأخیر و aria-describedby.',
      en: 'Hover/focus tooltip with positioning, delay and aria-describedby.',
    },
    render: () => <TooltipShowcase />,
  },
  {
    id: 'dropdown-menu',
    code: 'DropdownMenu',
    file: 'DropdownMenu.tsx',
    source: dropdownMenuSource,
    usage: [
      {
        label: U.basic,
        code: `<DropdownMenu
  label="Actions"
  items={[
    { label: 'Edit', onSelect: () => edit() },
    { label: 'Duplicate', onSelect: () => copy() },
    { label: 'Delete', onSelect: () => remove() },
  ]}
/>`,
      },
      {
        label: U.states,
        code: `items={[{ label: 'Archive', disabled: true }]}`,
      },
      {
        label: { fa: 'تراز کردنِ منو', en: 'Menu alignment' },
        code: `<DropdownMenu label="Options" align="end" items={items} />`,
      },
    ],
    name: { fa: 'منوی کشویی', en: 'Dropdown Menu' },
    description: {
      fa: 'منوی کشویی در portal با ناوبریِ کیبورد و roving focus.',
      en: 'Dropdown menu in a portal with keyboard navigation and roving focus.',
    },
    render: () => <DropdownMenuShowcase />,
  },
  {
    id: 'separator',
    code: 'Separator',
    file: 'Separator.tsx',
    source: separatorSource,
    usage: [
      {
        label: U.basic,
        code: `<span>Profile</span>
<Separator />
<span>Settings</span>`,
      },
      {
        label: { fa: 'عمودی', en: 'Vertical' },
        code: `<div className="flex h-5 items-center gap-3">
  <span>Blog</span>
  <Separator orientation="vertical" />
  <span>Docs</span>
</div>`,
      },
      {
        label: { fa: 'معنایی (نه تزئینی)', en: 'Semantic (non-decorative)' },
        code: `<Separator decorative={false} /> {/* exposes role="separator" */}`,
      },
    ],
    name: { fa: 'جداکننده', en: 'Separator' },
    description: {
      fa: 'خطِ نازکِ افقی یا عمودی برای جداسازی محتوا.',
      en: 'A thin horizontal or vertical divider line.',
    },
    render: () => <SeparatorShowcase />,
  },
  {
    id: 'label',
    code: 'Label',
    file: 'Label.tsx',
    source: labelSource,
    usage: [
      {
        label: U.basic,
        code: `<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />`,
      },
      { label: { fa: 'الزامی', en: 'Required' }, code: `<Label htmlFor="email" required>Email</Label>` },
      {
        label: { fa: 'با کنترلِ peer', en: 'With a peer control' },
        code: `<input id="terms" type="checkbox" className="peer" />
<Label htmlFor="terms">I accept</Label> {/* dims when the input is disabled */}`,
      },
    ],
    name: { fa: 'برچسب', en: 'Label' },
    description: {
      fa: 'برچسبِ فرم با اتصالِ htmlFor و علامتِ الزامی.',
      en: 'A form label with htmlFor wiring and a required marker.',
    },
    render: () => <LabelShowcase />,
  },
  {
    id: 'kbd',
    code: 'Kbd',
    file: 'Kbd.tsx',
    source: kbdSource,
    usage: [
      { label: U.basic, code: `<Kbd>Esc</Kbd>` },
      {
        label: { fa: 'ترکیبِ کلیدها', en: 'Key combo' },
        code: `<span className="flex gap-1">
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</span>`,
      },
    ],
    name: { fa: 'کلیدِ میان‌بر', en: 'Kbd' },
    description: {
      fa: 'نمایشِ کلیدِ کیبورد، همیشه LTR داخلِ متنِ راست‌چین.',
      en: 'Renders a keyboard key, always LTR inside RTL text.',
    },
    render: () => <KbdShowcase />,
  },
  {
    id: 'spinner',
    code: 'Spinner',
    file: 'Spinner.tsx',
    source: spinnerSource,
    usage: [
      { label: U.basic, code: `<Spinner />` },
      {
        label: U.sizes,
        code: `<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`,
      },
      {
        label: { fa: 'لیبل و درخطِ متن', en: 'Label & inline' },
        code: `<span className="inline-flex items-center gap-2">
  <Spinner size="sm" label="Loading" /> Loading…
</span>`,
      },
    ],
    name: { fa: 'اسپینر', en: 'Spinner' },
    description: {
      fa: 'اسپینرِ بارگذاری از یک دایرهٔ حاشیه‌دار، بدونِ SVG.',
      en: 'A loading spinner from a bordered circle, no inline SVG.',
    },
    render: () => <SpinnerShowcase />,
  },
  {
    id: 'aspect-ratio',
    code: 'AspectRatio',
    file: 'AspectRatio.tsx',
    source: aspectRatioSource,
    usage: [
      {
        label: U.basic,
        code: `<AspectRatio ratio={16 / 9}>
  <img className="size-full object-cover" src="/cover.jpg" alt="" />
</AspectRatio>`,
      },
      {
        label: { fa: 'نسبت‌های دیگر', en: 'Other ratios' },
        code: `<AspectRatio ratio={1}>…</AspectRatio>      {/* square */}
<AspectRatio ratio={4 / 3}>…</AspectRatio>  {/* classic */}`,
      },
    ],
    name: { fa: 'نسبتِ ابعاد', en: 'Aspect Ratio' },
    description: {
      fa: 'نگه‌داشتنِ نسبتِ ابعاد با تکنیکِ padding (سازگار با مرورگرِ قدیمی).',
      en: 'Keeps a fixed ratio via padding-bottom (legacy-safe).',
    },
    render: () => <AspectRatioShowcase />,
  },
  {
    id: 'empty',
    code: 'Empty',
    file: 'Empty.tsx',
    source: emptySource,
    usage: [
      { label: U.basic, code: `<Empty title="No results" description="Try another search." />` },
      {
        label: { fa: 'با آیکون و کنش', en: 'With icon & action' },
        code: `<Empty icon={<Icon name="search" />} title="No results" description="Try another search.">
  <Button>New project</Button>
</Empty>`,
      },
    ],
    name: { fa: 'حالتِ خالی', en: 'Empty' },
    description: {
      fa: 'حالتِ خالی با آیکون، عنوان، توضیح و دکمهٔ کنش.',
      en: 'An empty state with icon, title, description and an action.',
    },
    render: () => <EmptyShowcase />,
  },
  {
    id: 'alert',
    code: 'Alert',
    file: 'Alert.tsx',
    source: alertSource,
    usage: [
      {
        label: U.variants,
        code: `<Alert variant="info" title="Update">A new version is ready.</Alert>
<Alert variant="success" title="Saved">Your changes were stored.</Alert>
<Alert variant="warning" title="Low storage">Only 10% left.</Alert>
<Alert variant="error" title="Payment failed">Your card was declined.</Alert>`,
      },
      { label: { fa: 'بدونِ عنوان', en: 'Body only' }, code: `<Alert variant="info">Just a one-line message.</Alert>` },
      {
        label: { fa: 'آیکونِ سفارشی / بدونِ آیکون', en: 'Custom / no icon' },
        code: `<Alert variant="success" icon={<Icon name="check" />}>…</Alert>
<Alert variant="info" icon={null}>No icon</Alert>`,
      },
    ],
    name: { fa: 'هشدار', en: 'Alert' },
    description: {
      fa: 'کادرِ پیامِ رنگی در چهار حالت با آیکون و نقشِ ARIA.',
      en: 'A coloured message callout in four variants with icon + ARIA role.',
    },
    render: () => <AlertShowcase />,
  },
  {
    id: 'breadcrumb',
    code: 'Breadcrumb',
    file: 'Breadcrumb.tsx',
    source: breadcrumbSource,
    usage: [
      {
        label: U.basic,
        code: `<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Model X' }, // last item = current page
]} />`,
      },
      { label: { fa: 'جداکنندهٔ سفارشی', en: 'Custom separator' }, code: `<Breadcrumb separator="/" items={items} />` },
      { label: { fa: 'لیبلِ landmark', en: 'Landmark label' }, code: `<Breadcrumb label="مسیر" items={items} />` },
    ],
    name: { fa: 'مسیر راهنما', en: 'Breadcrumb' },
    description: {
      fa: 'مسیرِ ناوبری؛ جداکننده در RTL برمی‌گردد و آخرین مورد صفحهٔ جاری است.',
      en: 'Navigation trail; separator flips in RTL, last item is the current page.',
    },
    render: () => <BreadcrumbShowcase />,
  },
  {
    id: 'toggle',
    code: 'Toggle',
    file: 'Toggle.tsx',
    source: toggleSource,
    usage: [
      { label: U.uncontrolled, code: `<Toggle defaultPressed>B</Toggle>` },
      {
        label: U.controlled,
        code: `const [bold, setBold] = useState(false)

<Toggle pressed={bold} onPressedChange={setBold}>B</Toggle>`,
      },
      {
        label: U.variants,
        code: `<Toggle variant="default">A</Toggle>
<Toggle variant="outline">B</Toggle>`,
      },
      {
        label: U.sizes,
        code: `<Toggle size="sm">S</Toggle>
<Toggle size="md">M</Toggle>
<Toggle size="lg">L</Toggle>`,
      },
    ],
    name: { fa: 'دکمهٔ دوحالته', en: 'Toggle' },
    description: {
      fa: 'دکمهٔ دوحالته با aria-pressed، کنترل‌شده یا آزاد.',
      en: 'A two-state button with aria-pressed, controlled or uncontrolled.',
    },
    render: () => <ToggleShowcase />,
  },
  {
    id: 'toggle-group',
    code: 'ToggleGroup',
    file: 'ToggleGroup.tsx',
    source: toggleGroupSource,
    usage: [
      {
        label: { fa: 'تک‌انتخابی', en: 'Single select' },
        code: `<ToggleGroup
  type="single"
  defaultValue="center"
  items={[
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ]}
/>`,
      },
      {
        label: { fa: 'چندانتخابی', en: 'Multiple select' },
        code: `const [v, setV] = useState(['bold'])

<ToggleGroup type="multiple" value={v} onValueChange={setV} items={items} />`,
      },
      {
        label: U.sizes,
        code: `<ToggleGroup size="sm" items={items} />
<ToggleGroup size="lg" items={items} />`,
      },
      { label: U.states, code: `items={[{ value: 'x', label: 'X', disabled: true }]}` },
    ],
    name: { fa: 'گروهِ دوحالته', en: 'Toggle Group' },
    description: {
      fa: 'مجموعهٔ دکمه‌های دوحالته، تک‌انتخابی یا چندانتخابی، به‌هم‌چسبیده.',
      en: 'A set of toggle buttons, single- or multi-select, visually joined.',
    },
    render: () => <ToggleGroupShowcase />,
  },
  {
    id: 'button-group',
    code: 'ButtonGroup',
    file: 'ButtonGroup.tsx',
    source: buttonGroupSource,
    usage: [
      {
        label: U.basic,
        code: `<ButtonGroup>
  <Button variant="outline">Day</Button>
  <Button variant="outline">Week</Button>
  <Button variant="outline">Month</Button>
</ButtonGroup>`,
      },
      {
        label: { fa: 'عمودی', en: 'Vertical' },
        code: `<ButtonGroup orientation="vertical">
  <Button variant="secondary">Top</Button>
  <Button variant="secondary">Bottom</Button>
</ButtonGroup>`,
      },
    ],
    name: { fa: 'گروهِ دکمه', en: 'Button Group' },
    description: {
      fa: 'چسباندنِ چند دکمه به یک کنترلِ بخش‌بخش با گوشه‌های بیرونیِ گرد.',
      en: 'Joins buttons into one segmented control with rounded outer ends.',
    },
    render: () => <ButtonGroupShowcase />,
  },
  {
    id: 'input-group',
    code: 'InputGroup',
    file: 'InputGroup.tsx',
    source: inputGroupSource,
    usage: [
      { label: { fa: 'افزونهٔ ابتدا', en: 'Leading addon' }, code: `<InputGroup leading={<Icon name="search" />} placeholder="Search…" type="search" />` },
      { label: { fa: 'افزونهٔ انتها', en: 'Trailing addon' }, code: `<InputGroup trailing={<span>kg</span>} inputMode="numeric" />` },
      { label: { fa: 'هر دو', en: 'Both' }, code: `<InputGroup leading={<span>https://</span>} trailing={<Icon name="check" />} />` },
      { label: U.states, code: `<InputGroup disabled placeholder="Disabled" />` },
    ],
    name: { fa: 'گروهِ ورودی', en: 'Input Group' },
    description: {
      fa: 'ورودی با افزونه‌های ابتدا/انتها داخلِ یک قابِ واحد و حلقهٔ فوکوس مشترک.',
      en: 'An input with leading/trailing addons in one shell with a shared focus ring.',
    },
    render: () => <InputGroupShowcase />,
  },
  {
    id: 'item',
    code: 'Item',
    file: 'Item.tsx',
    source: itemSource,
    usage: [
      { label: U.basic, code: `<Item title="Ada Lovelace" description="Engineer" />` },
      {
        label: { fa: 'با اسلات‌ها', en: 'With slots' },
        code: `<Item
  leading={<Avatar fallback="AL" />}
  title="Ada Lovelace"
  description="Engineer"
  trailing={<Badge>Online</Badge>}
/>`,
      },
      {
        label: { fa: 'تعاملی', en: 'Interactive' },
        code: `<Item interactive title="Settings" trailing={<Icon name="search" />} />`,
      },
      {
        label: { fa: 'محتوای دلخواه', en: 'Custom content' },
        code: `<Item leading={<Icon name="copy" />}>
  <CustomBody />
</Item>`,
      },
    ],
    name: { fa: 'ردیفِ محتوا', en: 'Item' },
    description: {
      fa: 'ردیفِ منعطف: اسلاتِ ابتدا، عنوان+توضیح، اسلاتِ انتها.',
      en: 'A flexible row: leading slot, title + description, trailing slot.',
    },
    render: () => <ItemShowcase />,
  },
  {
    id: 'field',
    code: 'Field',
    file: 'Field.tsx',
    source: fieldSource,
    usage: [
      {
        label: U.basic,
        code: `<Field label="Email">
  <Input type="email" />
</Field>`,
      },
      {
        label: { fa: 'توضیح و الزامی', en: 'Description & required' },
        code: `<Field label="Email" required description="We never share it.">
  <Input type="email" />
</Field>`,
      },
      {
        label: U.error,
        code: `<Field label="Email" error="Enter a valid email.">
  {/* the control gets aria-invalid + aria-describedby automatically */}
  <Input type="email" />
</Field>`,
      },
      {
        label: { fa: 'هر کنترلی', en: 'Any control' },
        code: `<Field label="Bio">
  <Textarea />
</Field>`,
      },
    ],
    name: { fa: 'فیلدِ فرم', en: 'Field' },
    description: {
      fa: 'پوششِ فیلد که خودکار label، aria-describedby و aria-invalid را سیم‌کشی می‌کند.',
      en: 'A field wrapper that auto-wires the label, aria-describedby and aria-invalid.',
    },
    render: () => <FieldShowcase />,
  },
  {
    id: 'pagination',
    code: 'Pagination',
    file: 'Pagination.tsx',
    source: paginationSource,
    usage: [
      {
        label: U.basic,
        code: `const [page, setPage] = useState(1)

<Pagination page={page} count={12} onPageChange={setPage} />`,
      },
      {
        label: { fa: 'تعدادِ همسایه‌ها', en: 'Sibling count' },
        code: `<Pagination page={page} count={50} siblingCount={2} onPageChange={setPage} />`,
      },
      {
        label: { fa: 'لیبل‌ها (i18n)', en: 'Labels (i18n)' },
        code: `<Pagination page={page} count={12} onPageChange={setPage} prevLabel="قبلی" nextLabel="بعدی" />`,
      },
    ],
    name: { fa: 'صفحه‌بندی', en: 'Pagination' },
    description: {
      fa: 'ناوبریِ صفحه با نقطه‌چین و فلش‌هایی که در RTL برمی‌گردند.',
      en: 'Page navigation with ellipses and arrows that flip in RTL.',
    },
    render: () => <PaginationShowcase />,
  },
  {
    id: 'table',
    code: 'Table',
    file: 'Table.tsx',
    source: tableSource,
    usage: [
      {
        label: U.basic,
        code: `<Table
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
  ]}
  data={[{ name: 'Ada', role: 'Engineer' }]}
/>`,
      },
      {
        label: { fa: 'سلولِ سفارشی و تراز', en: 'Custom cell & align' },
        code: `columns={[
  { key: 'status', header: 'Status', align: 'end', cell: (row) => <Badge>{row.status}</Badge> },
]}`,
      },
      {
        label: { fa: 'کپشن و حالتِ خالی', en: 'Caption & empty' },
        code: `<Table columns={cols} data={[]} caption="Team" emptyContent="No members yet" getRowKey={(r) => r.id} />`,
      },
    ],
    name: { fa: 'جدول', en: 'Table' },
    description: {
      fa: 'جدولِ داده‌محور و جنریک روی <table> نیتیو، با اسکرولِ افقی.',
      en: 'A data-driven, generic table on native <table>, with horizontal scroll.',
    },
    render: () => <TableShowcase />,
  },
  {
    id: 'scroll-area',
    code: 'ScrollArea',
    file: 'ScrollArea.tsx',
    source: scrollAreaSource,
    usage: [
      {
        label: U.basic,
        code: `<ScrollArea className="h-56">
  {/* long content */}
</ScrollArea>`,
      },
      {
        label: { fa: 'افقی', en: 'Horizontal' },
        code: `<ScrollArea orientation="horizontal" className="w-full">
  <WideContent />
</ScrollArea>`,
      },
      { label: { fa: 'هر دو محور', en: 'Both axes' }, code: `<ScrollArea orientation="both" className="h-72 w-full">…</ScrollArea>` },
    ],
    name: { fa: 'ناحیهٔ اسکرول', en: 'Scroll Area' },
    description: {
      fa: 'ظرفِ اسکرول با اسکرول‌بارِ باریکِ استایل‌خورده (WebKit + Firefox).',
      en: 'A scroll container with slim, styled scrollbars (WebKit + Firefox).',
    },
    render: () => <ScrollAreaShowcase />,
  },
  {
    id: 'collapsible',
    code: 'Collapsible',
    file: 'Collapsible.tsx',
    source: collapsibleSource,
    usage: [
      {
        label: U.uncontrolled,
        code: `<Collapsible trigger="Order details" defaultOpen>
  Shipped on June 4.
</Collapsible>`,
      },
      {
        label: U.controlled,
        code: `const [open, setOpen] = useState(false)

<Collapsible trigger="Show more" open={open} onOpenChange={setOpen}>
  …
</Collapsible>`,
      },
      {
        label: U.states,
        code: `<Collapsible trigger="Locked" disabled>…</Collapsible>
<Collapsible trigger="No chevron" hideChevron>…</Collapsible>`,
      },
    ],
    name: { fa: 'بازشونده', en: 'Collapsible' },
    description: {
      fa: 'یک ناحیهٔ بازشونده با انیمیشنِ ارتفاعِ سازگار با مرورگرِ قدیمی.',
      en: 'A single show/hide region with a legacy-safe height animation.',
    },
    render: () => <CollapsibleShowcase />,
  },
  {
    id: 'popover',
    code: 'Popover',
    file: 'Popover.tsx',
    source: popoverSource,
    usage: [
      {
        label: U.basic,
        code: `<Popover trigger="Open">
  <p>Floating content</p>
</Popover>`,
      },
      {
        label: { fa: 'تراز و فاصله', en: 'Align & offset' },
        code: `<Popover trigger="Settings" align="end" sideOffset={12}>
  <Settings />
</Popover>`,
      },
      {
        label: { fa: 'محتوای فرم‌دار', en: 'Form content' },
        code: `<Popover trigger="Dimensions" contentClassName="w-80">
  <label>Width <Input /></label>
  <Button>Apply</Button>
</Popover>`,
      },
    ],
    name: { fa: 'پاپ‌اوور', en: 'Popover' },
    description: {
      fa: 'پنلِ شناورِ کلیکی در portal؛ با بستن روی کلیکِ بیرون و Escape.',
      en: 'A click-triggered floating panel in a portal; closes on outside-click and Escape.',
    },
    render: () => <PopoverShowcase />,
  },
  {
    id: 'hover-card',
    code: 'HoverCard',
    file: 'HoverCard.tsx',
    source: hoverCardSource,
    usage: [
      {
        label: U.basic,
        code: `<HoverCard trigger={<button>@ada</button>}>
  <Profile />
</HoverCard>`,
      },
      {
        label: { fa: 'تأخیرِ باز/بسته', en: 'Open / close delay' },
        code: `<HoverCard openDelay={500} closeDelay={100} trigger={trigger}>
  …
</HoverCard>`,
      },
      { label: { fa: 'تراز', en: 'Align' }, code: `<HoverCard align="start" trigger={trigger}>…</HoverCard>` },
    ],
    name: { fa: 'کارتِ هاور', en: 'Hover Card' },
    description: {
      fa: 'کارتِ پیش‌نمایش با hover/focus، تأخیرِ باز/بسته و رندر در portal.',
      en: 'A preview card on hover/focus with open/close delays, portal-rendered.',
    },
    render: () => <HoverCardShowcase />,
  },
  {
    id: 'context-menu',
    code: 'ContextMenu',
    file: 'ContextMenu.tsx',
    source: contextMenuSource,
    usage: [
      {
        label: U.basic,
        code: `<ContextMenu
  items={[
    { label: 'Copy', onSelect: () => copy() },
    { label: 'Delete', onSelect: () => remove() },
  ]}
>
  <div>Right-click me</div>
</ContextMenu>`,
      },
      { label: U.states, code: `items={[{ label: 'Paste', disabled: true }]}` },
    ],
    name: { fa: 'منوی راست‌کلیک', en: 'Context Menu' },
    description: {
      fa: 'منوی راست‌کلیک در محلِ نشانگر، با ناوبریِ کیبورد و رندر در portal.',
      en: 'A right-click menu at the cursor, with keyboard nav, portal-rendered.',
    },
    render: () => <ContextMenuShowcase />,
  },
  {
    id: 'sheet',
    code: 'Sheet',
    file: 'Sheet.tsx',
    source: sheetSource,
    usage: [
      {
        label: U.basic,
        code: `const [open, setOpen] = useState(false)

<Sheet open={open} onOpenChange={setOpen} side="end" title="Filters">
  <Filters />
</Sheet>`,
      },
      {
        label: { fa: 'جهت‌ها (آگاه به RTL)', en: 'Sides (RTL-aware)' },
        code: `<Sheet side="start" … />   {/* inline-start */}
<Sheet side="end" … />     {/* inline-end */}
<Sheet side="top" … />
<Sheet side="bottom" … />`,
      },
      {
        label: { fa: 'با فوتر', en: 'With footer' },
        code: `<Sheet open={open} onOpenChange={setOpen} title="Filters" footer={<Button>Apply</Button>}>
  …
</Sheet>`,
      },
    ],
    name: { fa: 'کشو', en: 'Sheet' },
    description: {
      fa: 'کشوی کناری از هر لبه؛ start/end آگاه به RTL، با همان دسترس‌پذیریِ Dialog.',
      en: 'A drawer from any edge; start/end are RTL-aware, with Dialog-grade a11y.',
    },
    render: () => <SheetShowcase />,
  },
  {
    id: 'alert-dialog',
    code: 'AlertDialog',
    file: 'AlertDialog.tsx',
    source: alertDialogSource,
    usage: [
      {
        label: { fa: 'مخرب (قرمز)', en: 'Destructive (red)' },
        code: `<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  description="This cannot be undone."
  destructive
  confirmText="Delete"
  onConfirm={remove}
/>`,
      },
      {
        label: { fa: 'عادی (کهربایی)', en: 'Neutral (amber)' },
        code: `<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Publish project?"
  description="It becomes visible to everyone."
  confirmText="Publish"
  onConfirm={publish}
/>`,
      },
      {
        label: { fa: 'لیبل‌ها و آیکون', en: 'Labels & icon' },
        code: `<AlertDialog
  cancelText="انصراف"
  confirmText="حذف"
  icon={<Icon name="close" />}  // or icon={null} to hide
  …
/>`,
      },
    ],
    name: { fa: 'دیالوگِ تأیید', en: 'Alert Dialog' },
    description: {
      fa: 'تأییدِ مخرب/مهم با نشانِ آیکونی — برخلافِ Dialog، نه دکمهٔ بستن دارد نه با کلیکِ بیرون بسته می‌شود؛ باید Cancel/Confirm بزنی.',
      en: 'A destructive/blocking confirm with an icon badge — unlike Dialog it has no close button and no overlay dismiss; a Cancel/Confirm choice is required.',
    },
    render: () => <AlertDialogShowcase />,
  },
  {
    id: 'calendar',
    code: 'Calendar',
    file: 'Calendar.tsx',
    source: calendarSource,
    usage: [
      {
        label: U.basic,
        code: `const [date, setDate] = useState<Date | null>(null)

<Calendar value={date} onChange={setDate} />`,
      },
      {
        label: { fa: 'بازهٔ مجاز (min/max)', en: 'Min / max range' },
        code: `<Calendar min={new Date()} max={addDays(new Date(), 30)} />`,
      },
      {
        label: { fa: 'بومی‌سازی و شروعِ هفته', en: 'Locale & week start' },
        code: `{/* Persian month names, Saturday-first */}
<Calendar locale="fa-IR-u-ca-gregory" weekStartsOn={6} />`,
      },
      { label: { fa: 'ماهِ اولیه', en: 'Initial month' }, code: `<Calendar defaultMonth={new Date(2024, 0, 1)} />` },
    ],
    name: { fa: 'تقویم', en: 'Calendar' },
    description: {
      fa: 'تقویمِ میلادی با انتخابِ روز، نام‌ها از Intl و ناوبریِ کاملِ کیبورد.',
      en: 'A Gregorian calendar with day selection, Intl names and full keyboard nav.',
    },
    render: () => <CalendarShowcase />,
  },
  {
    id: 'combobox',
    code: 'Combobox',
    file: 'Combobox.tsx',
    source: comboboxSource,
    usage: [
      {
        label: U.basic,
        code: `const [value, setValue] = useState<string | null>(null)

<Combobox
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ]}
  value={value}
  onChange={setValue}
  placeholder="Pick a framework…"
/>`,
      },
      {
        label: U.states,
        code: `options={[{ value: 'qwik', label: 'Qwik', disabled: true }]}

<Combobox disabled options={options} />`,
      },
      { label: { fa: 'متنِ خالی‌بودن', en: 'Empty text' }, code: `<Combobox options={options} emptyText="No results" />` },
    ],
    name: { fa: 'کمبوباکس', en: 'Combobox' },
    description: {
      fa: 'ورودی + لیست‌باکسِ فیلترشونده در portal، با aria-activedescendant.',
      en: 'An input + filterable listbox in a portal, with aria-activedescendant.',
    },
    render: () => <ComboboxShowcase />,
  },
  {
    id: 'command',
    code: 'Command',
    file: 'Command.tsx',
    source: commandSource,
    usage: [
      {
        label: U.basic,
        code: `<Command items={[
  { value: 'new', label: 'New file', group: 'File', onSelect: () => createFile() },
  { value: 'open', label: 'Open file', group: 'File' },
  { value: 'settings', label: 'Settings', group: 'General' },
]} />`,
      },
      {
        label: { fa: 'آیکون، میان‌بر، کلیدواژه', en: 'Icon, shortcut, keywords' },
        code: `{
  value: 'copy',
  label: 'Copy link',
  icon: <Icon name="copy" />,
  shortcut: <Kbd>⌘C</Kbd>,
  keywords: ['share', 'url'], // also matched when filtering
  onSelect: () => copy(),
}`,
      },
      {
        label: { fa: 'داخلِ دیالوگ (⌘K)', en: 'Inside a Dialog (⌘K)' },
        code: `<Dialog open={open} onOpenChange={setOpen}>
  <Command items={items} />
</Dialog>`,
      },
    ],
    name: { fa: 'پنل دستورات', en: 'Command' },
    description: {
      fa: 'پنلِ دستورات: جست‌وجوی گروه‌بندی‌شده با فیلتر و ناوبریِ کیبورد.',
      en: 'A command palette: grouped, filterable search with keyboard nav.',
    },
    render: () => <CommandShowcase />,
  },
  {
    id: 'menubar',
    code: 'Menubar',
    file: 'Menubar.tsx',
    source: menubarSource,
    usage: [
      {
        label: U.basic,
        code: `<Menubar menus={[
  { label: 'File', items: [
    { label: 'New', onSelect: () => {} },
    { label: 'Open', onSelect: () => {} },
  ] },
  { label: 'Edit', items: [{ label: 'Undo', onSelect: () => {} }] },
]} />`,
      },
      { label: U.states, code: `items: [{ label: 'Redo', disabled: true }]` },
    ],
    name: { fa: 'نوار منو', en: 'Menubar' },
    description: {
      fa: 'نوار منوی دسکتاپی؛ یک منوی باز در لحظه، با ناوبریِ کاملِ کیبورد.',
      en: 'A desktop menubar; one open menu at a time, with full keyboard nav.',
    },
    render: () => <MenubarShowcase />,
  },
  {
    id: 'navigation-menu',
    code: 'NavigationMenu',
    file: 'NavigationMenu.tsx',
    source: navigationMenuSource,
    usage: [
      {
        label: { fa: 'لینکِ ساده + پنل', en: 'Plain link + panel' },
        code: `<NavigationMenu items={[
  { label: 'Products', content: [
    { label: 'Analytics', href: '/a', description: 'Track metrics' },
    { label: 'Billing', href: '/b' },
  ] },
  { label: 'Pricing', href: '/pricing' }, // plain link, no dropdown
]} />`,
      },
      { label: { fa: 'محتوای دلخواه', en: 'Custom panel content' }, code: `{ label: 'Resources', content: <MegaMenu /> }` },
      { label: { fa: 'لیبلِ landmark', en: 'Landmark label' }, code: `<NavigationMenu label="اصلی" items={items} />` },
    ],
    name: { fa: 'منوی ناوبری', en: 'Navigation Menu' },
    description: {
      fa: 'نوار ناوبری با پنل‌های کشویی روی hover/focus، رندر در portal.',
      en: 'A nav bar with dropdown panels on hover/focus, portal-rendered.',
    },
    render: () => <NavigationMenuShowcase />,
  },
  {
    id: 'sidebar',
    code: 'Sidebar',
    file: 'Sidebar.tsx',
    source: sidebarSource,
    usage: [
      {
        label: U.basic,
        code: `<Sidebar
  header={<Brand />}
  sections={[
    { label: 'Main', items: [
      { label: 'Dashboard', icon: <Icon name="menu" />, href: '#', active: true },
      { label: 'Search', icon: <Icon name="search" />, href: '#' },
    ] },
  ]}
/>`,
      },
      {
        label: { fa: 'جمع‌شده (ریلِ آیکونی)', en: 'Collapsed (icon rail)' },
        code: `const [collapsed, setCollapsed] = useState(false)

<Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} sections={sections} />`,
      },
      {
        label: { fa: 'فوتر و بَج', en: 'Footer & badge' },
        code: `<Sidebar
  footer={<UserChip />}
  sections={[
    { items: [{ label: 'Inbox', icon: <Icon name="copy" />, href: '#', badge: <Badge>3</Badge> }] },
  ]}
/>`,
      },
    ],
    name: { fa: 'نوار کناری', en: 'Sidebar' },
    description: {
      fa: 'نوار کناریِ اپ با بخش‌ها و آیتم‌ها، جمع‌شونده به ریلِ آیکونی.',
      en: 'An app sidebar with sections and items, collapsible to an icon rail.',
    },
    render: () => <SidebarShowcase />,
  },
  {
    id: 'resizable',
    code: 'Resizable',
    file: 'Resizable.tsx',
    source: resizableSource,
    usage: [
      {
        label: U.basic,
        code: `<Resizable
  first={<Nav />}
  second={<Content />}
  defaultSize={35}
/>`,
      },
      {
        label: { fa: 'عمودی + حدود', en: 'Vertical + limits' },
        code: `<Resizable orientation="vertical" minSize={20} maxSize={80} first={<Top />} second={<Bottom />} />`,
      },
      {
        label: U.controlled,
        code: `const [size, setSize] = useState(50)

<Resizable size={size} onSizeChange={setSize} first={a} second={b} />`,
      },
    ],
    name: { fa: 'تغییراندازه', en: 'Resizable' },
    description: {
      fa: 'دو پنل با دستگیرهٔ کشیدنی؛ کیبورد و RTL آگاه، نقشِ separator.',
      en: 'Two panels with a draggable handle; keyboard + RTL aware, separator role.',
    },
    render: () => <ResizableShowcase />,
  },
  {
    id: 'data-table',
    code: 'DataTable',
    file: 'DataTable.tsx',
    source: dataTableSource,
    usage: [
      {
        label: { fa: 'مرتب‌سازی + صفحه‌بندی', en: 'Sorting + pagination' },
        code: `<DataTable
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'age', header: 'Age', sortable: true, align: 'end' },
  ]}
  data={rows}
  pageSize={10}
  initialSort={{ key: 'name', direction: 'asc' }}
/>`,
      },
      {
        label: { fa: 'سلولِ سفارشی و کلیدِ مرتب‌سازی', en: 'Custom cell & sort key' },
        code: `{
  key: 'status',
  header: 'Status',
  sortable: true,
  sortValue: (row) => row.priority,          // sort by a different value
  cell: (row) => <Badge>{row.status}</Badge>,
}`,
      },
      {
        label: { fa: 'لیبل‌ها (i18n)', en: 'Labels (i18n)' },
        code: `<DataTable
  columns={cols}
  data={rows}
  pageSize={5}
  prevLabel="قبلی"
  nextLabel="بعدی"
  pageInfo={(p, n) => \`صفحهٔ \${p} از \${n}\`}
/>`,
      },
    ],
    name: { fa: 'جدول داده', en: 'Data Table' },
    description: {
      fa: 'جدول با مرتب‌سازی و صفحه‌بندیِ سمتِ کلاینت؛ جنریک و خودبسنده.',
      en: 'A table with client-side sorting and pagination; generic and self-contained.',
    },
    render: () => <DataTableShowcase />,
  },
  {
    id: 'chart',
    code: 'Chart',
    file: 'Chart.tsx',
    source: chartSource,
    usage: [
      {
        label: U.basic,
        code: `<Chart
  type="bar"
  data={[
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 19 },
    { label: 'Mar', value: 9 },
  ]}
/>`,
      },
      {
        label: U.variants,
        code: `<Chart type="bar" data={data} />
<Chart type="line" data={data} />`,
      },
      {
        label: { fa: 'رنگ، ارتفاع، قالبِ مقدار', en: 'Color, height, formatter' },
        code: `<Chart
  data={data}
  color="#10b981"
  height={260}
  valueFormatter={(v) => \`\${v}k\`}
/>`,
      },
    ],
    name: { fa: 'نمودار', en: 'Chart' },
    description: {
      fa: 'نمودارِ میله‌ای/خطی با SVGِ بومی، بدونِ کتابخانه و ریسپانسیو.',
      en: 'A bar/line chart in native SVG, dependency-free and responsive.',
    },
    render: () => <ChartShowcase />,
  },
]
