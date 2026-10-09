# konkur-front

اپ موبایل Study Tracker / کنکور ترکر (Next.js + Tailwind).

## اجرا

```bash
cd ~/Desktop/konkur-front
npm install
cp .env.local.example .env.local   # یا از .env.local موجود استفاده کنید
npm run dev
```

آدرس پیش‌فرض: http://127.0.0.1:3000 (در حال اجرا می‌تواند پورت دیگری مثل `3002` باشد).

بک‌اند باید روی `NEXT_PUBLIC_API_URL` در دسترس باشد (پیش‌فرض `http://127.0.0.1:8000/api/v1`).

### حساب دمو

- کاربر: `demo_student`
- رمز: `demo-pass-123`

(پس از `python manage.py seed_dev` در بک‌اند)

## ویژگی‌ها

- شِل موبایل RTL با فونت Vazirmatn و عرض حداکثر موبایل (`max-w-lg`)
- Bottom navbar ثابت (`fixed inset-x-0 bottom-0`) در همه صفحات اپ + safe-area
- ورود / ثبت‌نام JWT
- خانه، مطالعه (تایمر)، برنامه‌ریز، تحلیل، جامعه، پروفایل
- داشبورد مشاور و والدین
- اعلان‌ها

## نقش‌ها

از منوی بالای صفحه می‌توانید نقش نمایشی را عوض کنید؛ نَوبار پایین بر اساس نقش تغییر می‌کند.
