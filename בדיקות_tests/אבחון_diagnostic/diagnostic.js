// Translation dictionary
var currentLang = 'he';
const translations = {
  he: {
    title: 'בודק פגמים באתרוג',
    subtitle: 'מערכת לזיהוי חזותי של פגמים באתרוגים',
    instructions: 'הנחיות:',
    ins1: 'צלם את האתרוג בתאורה טובה, על רקע אחיד.',
    ins2: 'העלה תמונה ברורה של כל צדדי האתרוג.',
    ins3: 'ניתן לגרור ולשחרר תמונה או ללחוץ על "העלה תמונה".',
    tooltip: 'ניתן לגרור תמונה או ללחוץ',
    dragHint: 'ניתן לגרור תמונה לכאן',
    checkBtn: 'בדוק שוב',
    resultLabel: 'תוצאה:',
    exampleImg: 'דוגמה לאתרוג',
    loading: 'בודק...',
    resultOk: 'לא זוהו פגמים',
    resultMinor: 'נמצאו פגמים קלים',
    resultMajor: 'נמצאו פגמים חמורים',
    dragRelease: 'שחרר/י כאן את התמונה',
  },
      en: {
        title: 'Etrog Defect Checker',
        subtitle: 'Visual system for etrog defect detection',
        instructions: 'Instructions:',
        ins1: 'Photograph the etrog in good lighting, on a plain background.',
        ins2: 'Upload a clear image of all sides of the etrog.',
        ins3: 'You can drag & drop or click "Upload Image".',
        tooltip: 'You can drag an image or click',
        dragHint: 'Drag an image here',
        checkBtn: 'Check Again',
        resultLabel: 'Result:',
        exampleImg: 'Etrog Example',
        loading: 'Checking...',
        resultOk: 'No defects found',
        resultMinor: 'Minor defects found',
        resultMajor: 'Major defects found',
        dragRelease: 'Release image here',
      },
      ru: {
        title: 'Проверка этрога на дефекты',
        subtitle: 'Система визуального обнаружения дефектов этрога',
        instructions: 'Инструкция:',
        ins1: 'Сфотографируйте этрог при хорошем освещении на однотонном фоне.',
        ins2: 'Загрузите чёткое изображение всех сторон этрога.',
        ins3: 'Можно перетащить изображение или нажать "Загрузить".',
        tooltip: 'Можно перетащить или нажать',
        dragHint: 'Перетащите изображение сюда',
        checkBtn: 'Проверить снова',
        resultLabel: 'Результат:',
        exampleImg: 'Пример этрога',
        loading: 'Проверка...',
        resultOk: 'Дефекты не обнаружены',
        resultMinor: 'Обнаружены незначительные дефекты',
        resultMajor: 'Обнаружены серьёзные дефекты',
        dragRelease: 'Отпустите изображение здесь',
      },
      fr: {
        title: 'Vérificateur de défauts d’Etrog',
        subtitle: 'Système visuel de détection des défauts d’etrog',
        instructions: 'Instructions :',
        ins1: 'Photographiez l’etrog avec un bon éclairage, sur un fond uni.',
        ins2: 'Téléchargez une image claire de tous les côtés de l’etrog.',
        ins3: 'Vous pouvez glisser-déposer ou cliquer sur "Télécharger".',
        tooltip: 'Vous pouvez glisser-déposer ou cliquer',
        dragHint: 'Glissez une image ici',
        checkBtn: 'Vérifier à nouveau',
        resultLabel: 'Résultat :',
        exampleImg: 'Exemple d’etrog',
        loading: 'Vérification...',
        resultOk: 'Aucun défaut détecté',
        resultMinor: 'Défauts mineurs détectés',
        resultMajor: 'Défauts majeurs détectés',
        dragRelease: 'Déposez l’image ici',
      },
      th: {
        title: 'ตัวตรวจสอบตำหนิเอทโทรก',
        subtitle: 'ระบบตรวจสอบตำหนิเอทโทรกด้วยภาพ',
        instructions: 'คำแนะนำ:',
        ins1: 'ถ่ายภาพเอทโทรกในแสงที่ดี บนพื้นหลังเรียบ',
        ins2: 'อัปโหลดภาพที่ชัดเจนของเอทโทรกทุกด้าน',
        ins3: 'สามารถลากและวางหรือคลิก "อัปโหลด"',
        tooltip: 'สามารถลากรูปหรือคลิก',
        dragHint: 'ลากรูปมาที่นี่',
        checkBtn: 'ตรวจสอบอีกครั้ง',
        resultLabel: 'ผลลัพธ์:',
        exampleImg: 'ตัวอย่างเอทโทรก',
        loading: 'กำลังตรวจสอบ...',
        resultOk: 'ไม่พบตำหนิ',
        resultMinor: 'พบตำหนิเล็กน้อย',
        resultMajor: 'พบตำหนิรุนแรง',
        dragRelease: 'ปล่อยรูปที่นี่',
      },
    };

      // (Removed duplicate setLang function)

      // Hide example image if user uploaded/dragged image
      function hideExampleIfUserImage() {
        $('#example-img').hide();
      }


    $(function() {
      // Language switcher
      $('#lang-select').on('change', function() {
        setLang(this.value);
      });
      setLang($('#lang-select').val() || 'he');

      function setResult(resultKey) {
        const dict = translations[currentLang] || translations['he'];
        const $icon = $('#result-icon');
        $icon.empty();
        // Always reset animation
        $icon.removeClass('result-icon checkmark warning error');
        void $icon[0].offsetWidth;
        if (resultKey === 'resultOk') {
          $icon.html('✔️');
          $icon.addClass('result-icon checkmark');
          $icon.css('color', '#4caf50');
          $('.result-value').text(dict.resultOk);
          $('.result-area').css('background', '#e8fbe0');
        } else if (resultKey === 'resultMinor') {
          $icon.html('⚠️');
          $icon.addClass('result-icon warning');
          $icon.css('color', '#f7b801');
          $('.result-value').text(dict.resultMinor);
          $('.result-area').css('background', '#fffbe6');
        } else if (resultKey === 'resultMajor') {
          $icon.html('❌');
          $icon.addClass('result-icon error');
          $icon.css('color', '#e53935');
          $('.result-value').text(dict.resultMajor);
          $('.result-area').css('background', '#ffeaea');
        } else if (resultKey === 'loading') {
          $icon.html('');
          $icon.addClass('result-icon');
          $('.result-value').text(dict.loading);
          $('.result-area').css('background', '#f7ffe0');
        } else {
          $icon.html('');
          $icon.addClass('result-icon');
          $('.result-value').text('');
          $('.result-area').css('background', '#f7ffe0');
        }
        animateResultIcon();
      }

      function animateResultIcon() {
        const $icon = $('#result-icon');
        $icon.removeClass('result-icon');
        setTimeout(function() { $icon.addClass('result-icon'); }, 10);
      }

      // Animation replay (SVG)
      $('button[data-i18n="checkBtn"]').on('click', function(e) {
        $('body').addClass('restart');
        $('#loader').show();
        setResult('loading');
        setTimeout(function() {
          $('body').removeClass('restart');
          $('#loader').hide();
          // Simulate result
          const keys = ['resultOk', 'resultMinor', 'resultMajor'];
          const rand = Math.floor(Math.random() * keys.length);
          setResult(keys[rand]);
        }, 1800);
      });

      // Image upload and preview
      $('#etrog-upload').on('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        $('#file-name').text(file.name);
        const reader = new FileReader();
        reader.onload = function(ev) {
          $('#etrog-preview').html('<img src="' + ev.target.result + '" alt="Etrog" />');
          hideExampleIfUserImage();
        };
        reader.readAsDataURL(file);
        // Reset result and loader
        setResult('loading');
        $('#loader').show();
        setTimeout(function() {
          $('#loader').hide();
          const keys = ['resultOk', 'resultMinor', 'resultMajor'];
          const rand = Math.floor(Math.random() * keys.length);
          setResult(keys[rand]);
        }, 1800);
      });

      // Drag & Drop support
      const $drop = $('.etrog-preview');
      $drop.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $drop.addClass('dragover');
        $('.drag-hint').text(translations[currentLang].dragRelease);
      });
      $drop.on('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $drop.removeClass('dragover');
        $('.drag-hint').text(translations[currentLang].dragHint);
      });
      $drop.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $drop.removeClass('dragover');
        $('.drag-hint').text(translations[currentLang].dragHint);
        let dt = e.originalEvent.dataTransfer;
        if (dt && dt.files && dt.files.length) {
          const file = dt.files[0];
          $('#file-name').text(file.name);
          const reader = new FileReader();
          reader.onload = function(ev) {
            $('#etrog-preview').html('<img src="' + ev.target.result + '" alt="Etrog" />');
            hideExampleIfUserImage();
          };
          reader.readAsDataURL(file);
          setResult('loading');
          $('#loader').show();
          setTimeout(function() {
            $('#loader').hide();
            const keys = ['resultOk', 'resultMinor', 'resultMajor'];
            const rand = Math.floor(Math.random() * keys.length);

            setResult(keys[rand]);
          }, 1800);
        }
      });

      function setLang(lang) {
        currentLang = lang;
        const dict = translations[lang] || translations['he'];
        $('[data-i18n]').each(function() {
          const key = $(this).data('i18n');
          if (dict[key]) $(this).text(dict[key]);
        });
        // alt for example image
        $('[data-i18n-alt]').each(function() {
          const key = $(this).data('i18n-alt');
          if (dict[key]) $(this).attr('alt', dict[key]);
        });
        // Direction
        if (lang === 'he') {
          $('body').attr('dir', 'rtl');
        } else {
          $('body').attr('dir', 'ltr');
        }
        // Update dynamic texts
        $('.result-value').text(dict.resultOk);
        $('.drag-hint').text(dict.dragHint);
          $('.upload-tooltip').attr('aria-label', dict.tooltip);
        }
  
      }); // End of $(function() { ... })

