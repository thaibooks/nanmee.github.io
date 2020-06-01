function Uniland() {

    this.prelandMode = false;

    this.landId = null;
    this.landUrl = null;

    this.prelandId = null;
    this.prelandUrl = null;

    this.urlOrder = null;
    this.urlEmail = null;
    this.urlPixel = null;

    this.aliasName = 'name';
    this.aliasEmail = 'email';
    this.aliasPhone = 'phone';
    this.aliasCountry = 'country';
    this.aliasComment = 'comment';
    this.aliasGoodCode = 'good_code';
    this.aliasGoodPrice = 'good_price';
    this.aliasGoodsCount = 'goods_count';

    this.sendEmptyForm = true;

    this.run = function () {
        if (this.prelandMode) {
            // this.processPreland();
        } else {
            this.processForm();
        }
    };

    this.processPreland = function () {

        var url = this.landUrl;
        var separator = '';
        var subids = '';

        if (url.indexOf('?') > 0) {
            separator = '&';
        } else {
            separator = '?';
        }

        var params = {
            preland_id: this.prelandId,
            sub_id_1: this.getSubId('sub_id_1'),
            sub_id_2: this.getSubId('sub_id_2'),
            sub_id_3: this.getSubId('sub_id_3'),
            sub_id_4: this.getSubId('sub_id_4'),
            sub_id_5: this.getSubId('sub_id_5'),
            marker_id: this.getSubId('marker_id'),
            redirect_url: this.getSubId('redirect_url')
        };

        url = url + separator + this.serialize(params);

        console.log('Preland redirect url: ' + url);

        var els = document.querySelectorAll('a');
        for (var i = 0; i < els.length; i++) {
            els[i].setAttribute("href", url);
        }

        var time = (Date.now() - start) / 1000;
        console.log('Preland - ok, ' + time + ' sec');
    };

    /**
     * События на форму
     */
    this.processForm = function () {
        var uniland = this;
        var conversionId = this.getCookie('conversion_id');

        uniland.getSubId('sub_id_1');
        uniland.getSubId('sub_id_2');
        uniland.getSubId('sub_id_3');
        uniland.getSubId('sub_id_4');
        uniland.getSubId('sub_id_5');
        uniland.getSubId('marker_id');
        uniland.getSubId('preland_id');

        $('form').submit(function (event) {
            event.preventDefault();
            var name = $(this).find("[name='" + uniland.aliasName + "']").val();
            var email = $(this).find("[name='" + uniland.aliasEmail + "']").val();
            var phone = $(this).find("[name='" + uniland.aliasPhone + "']").val();
            var country = $(this).find("[name='" + uniland.aliasCountry + "']").val();
            var commarr = {};
            var index = "";
            var comment = $(this).find("[name^='" + uniland.aliasComment + "']").each(function () {
                index = $(this).attr('name');
                commarr[index]=$(this).val();
            });
            comment = JSON.stringify(commarr);
            var goodCode = $(this).find("[name='" + uniland.aliasGoodCode + "']").val();
            var goodsCount = $(this).find("[name='" + uniland.aliasGoodsCount + "']").val();
            var goodPrice = $(this).find("[name='" + uniland.aliasGoodPrice + "']").val();

            if (email) {
                email.trim();
            }

            if (name) {
                name.trim();
            }

            if (phone) {
                phone.trim();
            }

            console.log('name - ' + name);
            console.log('email - ' + email);
            console.log('phone - ' + phone);

            var params = {
                land_id: uniland.landId,
                preland_id: uniland.getSubId('preland_id'),
                conversion_id: conversionId,
                name: name,
                email: email,
                phone: phone,
                country: country,
                comment: comment,
                good_code: goodCode,
                goods_count: goodsCount,
                good_price: goodPrice,
                sub_id_1: uniland.getSubId('sub_id_1'),
                sub_id_2: uniland.getSubId('sub_id_2'),
                sub_id_3: uniland.getSubId('sub_id_3'),
                sub_id_4: uniland.getSubId('sub_id_4'),
                sub_id_5: uniland.getSubId('sub_id_5'),
                marker_id: uniland.getSubId('marker_id')
            };

            $this = this;
            if (email) {
                $.post(uniland.urlEmail, params)
                    .done(function (data) {
                        if (data.page) {
                            window.location = data.page;
                        } else {
                            alert("Ваша заявка отправлена");
                        }
                    });
            } else {

                var send = true;

                if (!uniland.sendEmptyForm) {
                    send = (name && name.length > 0 && phone && phone.length > 0);
                }

                if (send) {
                    $.post(uniland.urlOrder, params)
                        .done(function (data) {
                            var item = 'conversion_id' + '=' + data.conversion_id;
                            var date = new Date(new Date().getTime() + 60 * 1000 * 86400 * 365);
                            document.cookie = item + "; path=/; expires=" + date.toUTCString();

                            if (data.page) {
                                window.location = data.page;
                            } else {
                                alert("Ваша заявка отправлена, ждите звонка");
                            }
                        });
                } else {
                    alert('Заполните поля!');
                    console.log('Skip send for empty form');
                }
            }
        });
        var time = (Date.now() - start) / 1000;
        console.log('form - ok, ' + time + ' sec');
    };

    /**
     * Добавление пикселя
     */
    this.processPixel = function () {
        var prelandId = this.prelandId;
        if (!prelandId) {
            prelandId = this.getSubId('preland_id');
        }
        var params = {
            land_id: this.landId,
            preland_id: prelandId,
            sub_id_1: this.getSubId('sub_id_1'),
            sub_id_2: this.getSubId('sub_id_2'),
            sub_id_3: this.getSubId('sub_id_3'),
            sub_id_4: this.getSubId('sub_id_4'),
            sub_id_5: this.getSubId('sub_id_5'),
            marker_id: this.getSubId('marker_id')
        };
        var url = this.urlPixel + '?' + this.serialize(params);
        var urlHtml = '<img src="' + url + '">';
        document.body.innerHTML = document.body.innerHTML + urlHtml;
        var time = (Date.now() - start) / 1000;
        console.log('pixel - ok, ' + time + ' sec');
    };

    /**
     * Получение get-параметра
     * @param param
     * @returns {*|null}
     */
    this.getParam = function (param) {
        return (window.location.search.match(new RegExp('[?&]' + param + '=([^&]+)')) || [, null])[1];
    };

    /**
     * Получение sub_id из get-параметров или куки, запись в куку.
     * @param name
     * @returns {*|null}
     */
    this.getSubId = function (name) {
        var subid = this.getParam(name);
        if (subid) {
            this.setCookie(name, subid);
        } else {
            subid = this.getCookie(name);
        }
        if (subid == undefined) {
            subid = '';
        }
        return subid;
    };

    this.setCookie = function (name, value) {
        var item = name + '=' + value;
        var date = new Date(new Date().getTime() + 60 * 1000 * 86400 * 365);
        document.cookie = item + "; path=/; expires=" + date.toUTCString();
    };

    this.getCookie = function (name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    this.serialize = function (obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    };

    this.getMtGeo = function (defaulValue) {
        var value = this.getSubId('sub_id_3');

        value = this.regions[value];

        if (!value) {
            value = defaulValue;
        }
        return decodeURI(value);
    };

    this.getMtAge = function (defaulValue) {
        var value = this.getSubId('sub_id_5');
        if (!value) {
            value = defaulValue;
        }
        return decodeURI(value);
    };

    this.getMtGender = function (defaulValue) {
        var value = this.getSubId('sub_id_4');
        if (!value) {
            value = defaulValue;
        }
        return decodeURI(value);
    };

    this.setSpanValueByClass = function (className, value) {
        var items = document.getElementsByClassName(className);
        for (var i = 0; i < items.length; i++) {
            items[i].innerHTML = value;
        }
    };

    this.regions = {
        "1": "Чукотский автономный округ",
        "2": "Еврейская автономная область",
        "3": "Архангельская область",
        "4": "Карачаево-Черкесская Республика",
        "5": "Астраханская область",
        "6": "Республика Калмыкия",
        "7": "Алтайский край",
        "8": "Белгородская область",
        "9": "Чеченская Республика",
        "10": "Амурская область",
        "11": "Ханты-Мансийский автономный округ",
        "12": "Республика Тыва",
        "13": "Брянская область",
        "14": "Новгородская область",
        "15": "Ненецкий автономный округ",
        "16": "Узбекистан",
        "17": "Таджикистан",
        "18": "Приморский край",
        "19": "Республика Северная Осетия-Алания",
        "20": "Владимирская область",
        "21": "Волгоградская область",
        "22": "Кировская область",
        "23": "Вологодская область",
        "24": "Воронежская область",
        "25": "Эстония",
        "26": "Латвия",
        "27": "Литва",
        "28": "Казахстан",
        "29": "Грузия",
        "30": "Объединенные Арабские Эмираты",
        "31": "Кот-д'Ивуар",
        "32": "Свердловская область",
        "33": "Туркменистан",
        "34": "Кыргызстан",
        "35": "Финляндия",
        "36": "Португалия",
        "37": "Польша",
        "38": "Ивановская область",
        "39": "Удмуртская Республика",
        "40": "Иркутская область",
        "41": "Республика Марий Эл",
        "42": "Республика Татарстан",
        "43": "Калининградская область",
        "44": "Калужская область",
        "45": "Италия",
        "46": "Кемеровская область",
        "47": "Франция",
        "48": "Швеция",
        "49": "Швейцария",
        "50": "Великобритания",
        "51": "Нидерланды",
        "52": "Костромская область",
        "53": "Краснодарский край",
        "54": "Красноярский край",
        "55": "Испания",
        "56": "Курганская область",
        "57": "Курская область",
        "58": "Липецкая область",
        "60": "Чехия",
        "61": "Греция",
        "62": "Магаданская область",
        "63": "Норвегия",
        "64": "Республика Адыгея",
        "65": "Дания",
        "66": "Республика Дагестан",
        "67": "Мексика",
        "68": "Республика Корея",
        "69": "Саудовская Аравия",
        "70": "Москва и МО",
        "71": "Мурманская область",
        "72": "Тайвань",
        "73": "Гонконг",
        "74": "Таиланд",
        "75": "Кабардино-Балкарская Республика",
        "76": "Турция",
        "77": "Япония",
        "78": "Коста-Рика",
        "79": "Нижегородская область",
        "80": "Куба",
        "81": "Кипр",
        "82": "Доминиканская Республика",
        "83": "Эквадор",
        "84": "Египет",
        "85": "Новосибирская область",
        "86": "Эритрея",
        "88": "Эфиопия",
        "89": "Фиджи",
        "90": "Габон",
        "91": "Гана",
        "92": "Омская область",
        "93": "Орловская область",
        "94": "Оренбургская область",
        "95": "Гибралтар",
        "96": "Пензенская область",
        "97": "Пермский край",
        "98": "Камчатский край",
        "99": "Гренландия",
        "100": "Псковская область",
        "101": "Гвинейская республика",
        "102": "Гваделупа",
        "103": "Республика Гватемала",
        "104": "Ростовская область",
        "105": "Рязанская область",
        "106": "Самарская область",
        "107": "Санкт-Петербург и ЛО",
        "108": "Республика Мордовия",
        "109": "Саратовская область",
        "110": "Гвинея-Бисау",
        "111": "Гайана",
        "112": "Смоленская область",
        "113": "Гондурас",
        "114": "Ставропольский край",
        "115": "Хорватия",
        "116": "Гаити",
        "117": "Республика Коми",
        "118": "Венгрия",
        "119": "Индонезия",
        "120": "Тамбовская область",
        "121": "Ирландия",
        "122": "Индия",
        "123": "Тверская область",
        "124": "Ирак",
        "125": "Иран",
        "126": "Томская область",
        "127": "Тульская область",
        "128": "Тюменская область",
        "129": "Республика Бурятия",
        "130": "Ульяновская область",
        "131": "Исландия",
        "132": "Ямайка",
        "133": "Иордания",
        "134": "Республика Башкортостан",
        "135": "Хабаровский край",
        "136": "Кения",
        "137": "Корейская Народно-Демократическая Республика",
        "138": "Кувейт",
        "139": "Лаос",
        "140": "Чувашская Республика",
        "141": "Челябинская область",
        "142": "Лихтенштейн",
        "143": "Шри-Ланка",
        "144": "Читинская область",
        "145": "Сахалинская область",
        "146": "Республика Саха (Якутия)",
        "147": "Ярославская область",
        "148": "Республика Хакасия",
        "149": "Либерия",
        "150": "Республика Ингушетия",
        "151": "Лесото",
        "152": "Великое Герцогство Люксембург",
        "153": "Ливия",
        "154": "Марокко",
        "155": "Монако",
        "156": "Черногория",
        "157": "Мадагаскар",
        "158": "Македония",
        "159": "Мали",
        "160": "Мьянма",
        "161": "Монголия",
        "162": "Мавритания",
        "163": "Мальта",
        "164": "Мальдивы",
        "165": "Малави",
        "166": "Малайзия",
        "167": "Мозамбик",
        "168": "Намибия",
        "169": "Нигер",
        "170": "Республика Карелия",
        "171": "Нигерия",
        "172": "Ямало-Ненецкий автономный округ",
        "173": "Никарагуа",
        "174": "Непал",
        "175": "Новая Зеландия",
        "176": "Оман",
        "177": "Республика Панама",
        "178": "Перу",
        "179": "Папуа - Новая Гвинея",
        "180": "Филиппины",
        "181": "Пакистан",
        "182": "Пуэрто-Рико",
        "183": "Палестинская автономия",
        "184": "Парагвай",
        "185": "Катар",
        "186": "Румыния",
        "187": "Сербия",
        "188": "Россия",
        "189": "Руанда",
        "190": "Сейшельские острова",
        "191": "Молдова",
        "192": "Судан",
        "193": "Республика Сингапур",
        "194": "Словения",
        "195": "Словакия",
        "196": "Украина",
        "197": "Сьерра-Леоне",
        "198": "Республика Сан-Марино",
        "199": "Израиль",
        "200": "Соединенные Штаты Америки",
        "201": "Беларусь",
        "202": "Германия",
        "203": "Сенегал",
        "204": "Афганистан",
        "205": "Сомали",
        "206": "Албания",
        "207": "Алжирская Народная Демократическая Республика",
        "208": "Суринам",
        "209": "Андорра",
        "210": "Ангола",
        "211": "Сальвадор",
        "212": "Сирия",
        "213": "Того",
        "214": "Аргентина",
        "215": "Армения",
        "216": "Тунисская Республика",
        "217": "Австралия",
        "218": "Австрия",
        "219": "Азербайджан",
        "220": "Багамские острова",
        "221": "Бахрейн",
        "222": "Бангладеш",
        "223": "Королевство Тонга",
        "224": "Тринидад и Тобаго",
        "225": "Бельгия",
        "226": "Белиз",
        "227": "Бенин",
        "228": "Танзания",
        "229": "Бутан",
        "230": "Боливия",
        "231": "Босния и Герцеговина",
        "232": "Ботсвана",
        "233": "Уганда",
        "234": "Бразилия",
        "235": "Уругвай",
        "236": "Государство-город Ватикан",
        "237": "Болгария",
        "238": "Буркина-Фасо",
        "239": "Венесуэла",
        "240": "Камбоджа",
        "241": "Камерун",
        "242": "Канада",
        "243": "Вьетнам",
        "244": "Йемен",
        "245": "Центрально-Африканская Республика",
        "246": "Чад",
        "247": "Чили",
        "248": "Китай",
        "249": "Южно-Африканская Республика",
        "250": "Замбия",
        "251": "Колумбия",
        "252": "Зимбабве",
        "253": "Республика Конго",
        "254": "Демократическая Республика Конго",
        "255": "Острова Кука",
        "256": "Симферополь",
        "257": "Винницкая область",
        "258": "Волынская область",
        "259": "Днепропетровская область",
        "260": "Донецкая область",
        "261": "Житомирская область",
        "262": "Закарпатская область",
        "263": "Запорожская область",
        "264": "Ивано-Франковская область",
        "265": "Киевская область",
        "266": "Кировоградская область",
        "267": "Луганская область",
        "268": "Львовская область",
        "269": "Николаевская область",
        "270": "Одесская область",
        "271": "Полтавская область",
        "272": "Ровенская область",
        "273": "Севастополь",
        "274": "Сумская область",
        "275": "Тернопольская область",
        "276": "Харьковская область",
        "277": "Херсонская область",
        "278": "Хмельницкая область",
        "279": "Черкасская область",
        "280": "Черниговская область",
        "281": "Черновицкая область",
        "282": "Республика Алтай",
        "285": "Минская область",
        "286": "Брестская область",
        "287": "Витебская область",
        "288": "Гомельская область",
        "289": "Гродненская область",
        "290": "Могилёвская область",
        "291": "Айдахо",
        "292": "Айова",
        "293": "Алабама",
        "294": "Аляска",
        "295": "Аризона",
        "296": "Арканзас",
        "297": "Вайоминг",
        "298": "Вашингтон",
        "299": "Вермонт",
        "300": "Вирджиния",
        "301": "Висконсин",
        "302": "Гавайи",
        "303": "Делавэр",
        "304": "Джорджия",
        "305": "Западная Вирджиния",
        "306": "Иллинойс",
        "307": "Индиана",
        "308": "Калифорния",
        "309": "Канзас",
        "310": "Кентукки",
        "311": "Колорадо",
        "312": "Коннектикут",
        "313": "Луизиана",
        "314": "Массачусетс",
        "315": "Миннесота",
        "316": "Миссисипи",
        "317": "Миссури",
        "318": "Мичиган",
        "319": "Монтана",
        "320": "Мэн",
        "321": "Мэриленд",
        "322": "Небраска",
        "323": "Невада",
        "324": "Нью-Джерси",
        "325": "Нью-Йорк",
        "326": "Нью-Мексико",
        "327": "Нью-Хэмпшир",
        "328": "Огайо",
        "329": "Оклахома",
        "330": "Орегон",
        "331": "Пенсильвания",
        "332": "Род-Айленд",
        "333": "Северная Дакота",
        "334": "Северная Каролина",
        "335": "Теннесси",
        "336": "Техас",
        "337": "Федеральный округ Колумбия",
        "338": "Флорида",
        "339": "Южная Дакота",
        "340": "Южная Каролина",
        "341": "Юта",
        "342": "Баден-Вюртемберг",
        "343": "Бавария",
        "344": "Бремен",
        "345": "Гамбург",
        "346": "Гессен",
        "347": "Нижняя Саксония",
        "348": "Северный Рейн-Вестфалия",
        "349": "Рейнланд-Пфальц",
        "350": "Саар",
        "351": "Шлезвиг-Гольштейн",
        "352": "Бранденбург",
        "353": "Мекленбург - Передняя Померания",
        "354": "Саксония",
        "355": "Саксония-Анхальт",
        "356": "Тюрингия",
        "357": "Берлин",
        "362": "Мангистауская область",
        "363": "Актюбинская область",
        "364": "Алматы",
        "365": "Атырауская область",
        "366": "Карагандинская область",
        "367": "Костанайская область",
        "368": "Кызылординская область",
        "369": "Павлодарская область",
        "370": "Северо-Казахстанская область",
        "372": "Южно-Казахстанская область",
        "373": "Жамбылская область",
        "374": "Западно-Казахстанская область",
        "375": "Восточно-Казахстанская область",
        "378": "Астана",
        "379": "Акмолинская область",
        "383": "Алматинская область",
        "386": "Альберта",
        "387": "Квебек",
        "388": "Британская Колумбия",
        "389": "Онтарио",
        "390": "Манитоба",
        "391": "Нью-Брансуик",
        "392": "Саскачеван",
        "393": "Новая Шотландия",
        "394": "Остров Принца Эдварда",
        "395": "Юкон",
        "396": "Северо-Западные территории",
        "397": "Нунавут",
        "398": "Абхазия",
        "399": "Сухумский район",
        "401": "Маврикий",
        "402": "Ливан",
        "403": "Бруней",
        "404": "Свазиленд",
        "405": "Самоа",
        "406": "Сент-Винсент и Гренадины",
        "407": "Гамбия",
        "408": "Кабо-Верде",
        "409": "Республика Джибути",
        "410": "Вануату",
        "411": "Науру",
        "412": "Доминика",
        "413": "Антарктика",
        "414": "Экваториальная Гвинея",
        "415": "Восточный Тимор",
        "416": "Бурунди",
        "417": "Кирибати",
        "418": "Коморские острова",
        "419": "Сан-Томе и Принсипи",
        "443": "Либерецкий край",
        "444": "Среднечешский край",
        "445": "Устецкий край",
        "446": "Краловеградецкий край",
        "447": "Высочина",
        "448": "Карловарский край",
        "449": "Пардубицкий край",
        "450": "Пльзенский край",
        "451": "Оломоуцкий край",
        "452": "Моравскосилезский край",
        "453": "Злинский край",
        "454": "Южночешский край",
        "455": "Южноморавский край",
        "456": "Прага",
        "468": "Республика Крым",
        "1755": "Балви",
        "1756": "Вентспилс",
        "1757": "Даугавпилс",
        "1758": "Краслава",
        "1759": "Ливаны",
        "1760": "Лиепая",
        "1761": "Лудза",
        "1762": "Прейли",
        "1763": "Резекне",
        "1764": "Рига",
        "1765": "Цесис",
        "1766": "Юрмала",
        "1775": "Вильнюс",
        "1776": "Друскининкай",
        "1777": "Каунас",
        "1778": "Клайпеда",
        "1780": "Паланга",
        "1781": "Тракай",
        "1782": "Шяуляй",
        "5315": "Айзкраукле",
        "5316": "Алуксне",
        "5317": "Бауска",
        "5318": "Валка",
        "5319": "Валмиера",
        "5320": "Гулбене",
        "5321": "Добеле",
        "5322": "Екабпилс",
        "5323": "Елгава",
        "5324": "Кулдига",
        "5325": "Лимбажи",
        "5326": "Мадона",
        "5327": "Огре",
        "5328": "Салдус",
        "5329": "Талси",
        "5330": "Тукумс",
        "5331": "Алитус",
        "5332": "Аникщяй",
        "5333": "Биржай",
        "5335": "Варена",
        "5336": "Вилкавишкис",
        "5337": "Висагинас",
        "5338": "Зарасай",
        "5339": "Игналина",
        "5340": "Йонишкис",
        "5341": "Казлу-Руда",
        "5342": "Калвария",
        "5343": "Кедайняй",
        "5344": "Кельме",
        "5345": "Кретинга",
        "5346": "Кайшядорис",
        "5347": "Купишкис",
        "5348": "Лаздияй",
        "5349": "Мажейкяй",
        "5350": "Мариямполе",
        "5351": "Молетай",
        "5352": "Науйойи-Акмяне",
        "5355": "Пакруойис",
        "5356": "Паневежис",
        "5357": "Пасвалис",
        "5358": "Плунге",
        "5359": "Пренай",
        "5360": "Радвилишкис",
        "5361": "Расейняй",
        "5362": "Ретавас",
        "5363": "Рокишкис",
        "5364": "Скуодас",
        "5365": "Таураге",
        "5366": "Тельшай",
        "5367": "Утена",
        "5368": "Шакяй",
        "5369": "Шальчининкай",
        "5371": "Шилале",
        "5372": "Шилуте",
        "5373": "Ширвинтос",
        "5374": "Электренай",
        "5375": "Юрбакркас",
        "100001": "Бывший СССР",
        "100002": "Европа",
        "100003": "Азия",
        "100004": "Африка",
        "100005": "Северная Америка",
        "100006": "Латинская Америка",
        "100007": "Австралия и Океания",
        "100008": "Антарктика",
        "100009": "Остальной мир"
    }

}