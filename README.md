# نوتة

تطبيق ملاحظات أصفر سريع وسهل الاستخدام، مع قسم مصاريف وأزرار روابط سريعة. مبني بـ Next.js ويعمل كتطبيق يمكن تثبيته على الهاتف.

## المميزات

- ملاحظات ملونة مثل دفتر الهاتف
- حساب المصاريف حسب اليوم والشهر والفئة
- أزرار سريعة: تضع الرابط فيصير زر يفتح الموقع
- يعمل بدون إنترنت بعد التثبيت، والبيانات تبقى على الجهاز
- جاهز للرفع على Vercel

## التشغيل محلياً

```bash
npm install
npm run dev
```

ثم افتح [http://localhost:3000](http://localhost:3000)

## الرفع على GitHub ثم Vercel

```bash
git init
git add .
git commit -m "Add Nota notes and expenses app"
gh repo create nota --public --source=. --remote=origin --push
```

بعدها من [vercel.com](https://vercel.com):

1. Import the GitHub repository
2. Framework: Next.js
3. Deploy

أو من الطرفية بعد تثبيت Vercel CLI:

```bash
npx vercel
```
