import React from 'react';
import './AboutUs.css'; // Assuming you'll create a CSS file to style this component

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h2>قصتنا</h2>
      <div className="about-us-section">
        <div className="about-us-text">
          <p>
            في قلب كل إنسان، هناك رحلة من البحث عن الذات، رحلة قد لا نعرف نهايتها ولا كيف تبدأ، لكننا نجد أنفسنا في لحظة معينة، في مكان معين، وندرك فجأة أننا قد وصلنا. كانت رحلة محمد، الشيف الذي يروي قصته اليوم، مليئة بالتجارب والخيبات، لكنه لم يكن يعلم أن الطهي سيكون هو الطريق الذي سيأخذه ليحقق ذاته.
          </p>
        </div>
        <div className="about-us-image">
          <img src="/image/chef1.jpg" alt="Image 1" />
        </div>
      </div>

      <div className="about-us-section">
        <div className="about-us-image">
          <img src="/image/chef2.jpeg" alt="Image 2" />
        </div>
        <div className="about-us-text">
          <p>
            مع مرور الوقت، بدأ محمد يطبخ أكثر وأكثر، ومع كل طبق كان يتلقى المزيد من الإعجاب والمدح. لقد اكتشف أن الطهي لم يكن مجرد مهنة بالنسبة له، بل كان رسالته الحقيقية، وكان يجد فيه ذاته بالكامل. تلك اللحظات البسيطة التي تملأ الحياة بالفرح والرضا، كانت هي ما يمنحه القوة للاستمرار.
          </p>
        </div>
      </div>

      <div className="about-us-section">
        <div className="about-us-text">
          <p>
            لم يكن محمد مستعدًا للتنازل عن أي شيء عندما قرر أن يحقق حلمه. قرر أن يكون مطعمه مكانًا يقدم أجود الأطعمة، لا يتنازل عن الجودة مهما كانت الظروف. فكل طبق كان يعبر عن قلبه وروحه، وكل لحظة في المطبخ كانت تروي قصة من الشغف والتفاني. كان يعرف أن السر في النجاح ليس في عدد الزبائن، بل في تقديم تجربة طعام حقيقية تلامس القلوب.
          </p>
        </div>
        <div className="about-us-image">
          <img src="/image/chef3.jpeg" alt="Image 3" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
