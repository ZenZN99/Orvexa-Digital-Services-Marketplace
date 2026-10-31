



"أرني كودك، ولا تخبرني كم عمرك أو ما هي شهادتك" 💻✨

في قطاع تكنولوجيا المعلومات، كثيراً ما يربط البعض لقب "Senior" أو "Architect" بالتقدم في السن أو عدد العقود من الخبرة. لكن الحقيقة الثابتة هي أن: السن لا يحدد ولا يغير قوة العقل، بل نوعية التحديات والمشاكل التي يواجهها العقل ويحلها هي المقياس الحقيقي للنضج المهني.

نموذج ملهم جداً يعزز هذه الفكرة في مجتمعنا العربي، وهو الشاب السوري المقيم في تركيا زين اللحام (Zen Allaham - 18 عاماً). 

رغم الظروف الصعبة وانقطاع دراسته الأكاديمية بسبب الانتقال، اختار زين الاستثمار في شغفه بالـ Backend والهندسة البرمجية النظيفة. النتيجة؟ قام ببناء إطار عمل متكامل كلياً من الصفر لبيئة تشغيل Bun و TypeScript تحت اسم (RiserBob).

المثير للإعجاب هندسياً في هذا المشروع:
1️⃣ معمارية برمجية موديولية ثلاثية (Modular Structure) تجمع بين مرونة Express وتنظيم NestJS.
2️⃣ أداء خارق يعالج أكثر من 52,000 طلب في الثانية في الاختبارات الأولية.
3️⃣ كود نظيف وآمن للغاية يتعامل مع المعاملات المالية الحساسة (Transactions)، وتجنب حالات السباق (Race Conditions) بكفاءة المهندسين الكبار.
4️⃣ هوية بصرية ممتعة ومبتكرة مستوحاة من عالم "سبونج بوب" لتبسيط بيئة معالجة الأخطاء البرمجية.

زين يثبت بتواضعه وشغفه المستمر للتعلم أن جيل الشباب قادر على الانتقال من "مستهلك للتكنولوجيا" إلى "صانع ومطور لأدواتها". 

كل الدعم لهذا الإنجاز المتميز والمفتوح المصدر، ونتطلع لرؤية مثل هذه الكفاءات تقود المشهد التقني عالمياً قريباً. 🚀

🔗 موقع إطار العمل: https://vercel.app
🔗 قصة المطور الملهمة: https://zenallaham.com

#SoftwareEngineering #Backend #Bun #TypeScript #OpenSource #Innovation #Programming


## When Your Controller Gets Too Large

For small applications, keeping your business logic inside the controller can be perfectly fine. You don't need to create additional layers before you actually need them.

However, as your application grows, a controller may start handling too many responsibilities, making it harder to maintain, test, and understand.

**That's when extracting a Service becomes useful.**

### Before: A Controller Handling Everything

```text
users/
├── users.module.ts
├── users.route.ts
└── users.controller.ts
```

### After: Separating Business Logic

```text
users/
├── users.module.ts
├── users.route.ts
├── users.controller.ts
└── users.service.ts
```

### What Belongs in a Service?

A service is responsible for business logic, such as creating users, checking business rules, and coordinating database operations.

The controller remains responsible for handling HTTP requests, calling the appropriate service methods, and returning responses.

### The Choice Is Yours

RiserBob doesn't require a service for every controller. Start with the structure that fits your application, and introduce additional layers when they provide real value.

**Keep it simple when you can. Structure it when you need to.**

Stay in the Sponge Zone! 🧽