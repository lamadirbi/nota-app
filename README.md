# نوتة

تطبيق ملاحظات أصفر سريع وسهل الاستخدام، مع قسم مصاريف وأزرار روابط سريعة. مبني بـ Next.js ويعمل كتطبيق يمكن تثبيته على الهاتف.

المستودع: [github.com/lamadirbi/nota-app](https://github.com/lamadirbi/nota-app)

## المميزات

- ملاحظات ملونة مثل دفتر الهاتف
- حساب المصاريف حسب اليوم والشهر والفئة
- أزرار سريعة: تضع الرابط فيصير زر يفتح الموقع
- يعمل بدون إنترنت بعد التثبيت، والبيانات تبقى على الجهاز
- جاهز للرفع على Vercel

## التشغيل محلياً

```bash
cd nota
npm install
npm run dev
```

ثم افتح [http://localhost:3000](http://localhost:3000)

## الرفع على Vercel

افتح هذا الرابط واستورد المستودع:

[vercel.com/new/import](https://vercel.com/new/import?s=https://github.com/lamadirbi/nota-app)

1. اربط حساب GitHub
2. اختر مستودع `nota-app`
3. Framework: Next.js
4. اضغط Deploy

بعد الرفع، من الهاتف: افتح الموقع ثم **إضافة إلى الشاشة الرئيسية** لتثبيته كتطبيق.
