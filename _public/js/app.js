require.register("config.jsenv", function(exports, require, module){
    module.exports = {
  "BUILD": "git-unknown"
}
});
var deferSrcSetters, show;
deferSrcSetters = [];
angular.element(document).ready(function(){
  var i$, ref$, len$, func, results$ = [];
  for (i$ = 0, len$ = (ref$ = deferSrcSetters).length; i$ < len$; ++i$) {
    func = ref$[i$];
    results$.push(func());
  }
  return results$;
});
angular.module("g0v.tw", ['firebase', 'btford.markdown', 'pascalprecht.translate']).config(['$httpProvider', '$translateProvider'].concat(function($httpProvider, $translateProvider){
  var lang;
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $translateProvider.useStaticFilesLoader({
    prefix: '/translations/',
    suffix: '.json'
  });
  lang = window.location.pathname.split('/')[1];
  if (lang.match('html') || document.title.match('找不到')) {
    lang = window.navigator.userLanguage || window.navigator.language;
  }
  if (lang === 'zh-TW' || lang === 'en-US') {
    return $translateProvider.preferredLanguage(lang);
  }
})).factory({
  fireRoot: ['angularFireCollection'].concat(function(angularFireCollection){
    var url;
    url = "https://g0vsite.firebaseio.com";
    return new Firebase(url);
  })
}).factory({
  eventsPromise: ['$http'].concat(function($http){
    var apiEndpoint, config;
    apiEndpoint = 'http://www.kimonolabs.com/api/dzdrrgx6';
    config = {
      params: {
        apikey: 'c626b7443a0cbcb5525f492411d10567',
        callback: 'JSON_CALLBACK'
      }
    };
    return $http.jsonp(apiEndpoint, config).then(function(response){
      var results, transformFn, recent, past;
      results = response.data.results;
      transformFn = function(obj){
        return {
          link: obj.event.href,
          title: obj.event.text
        };
      };
      recent = results.recent.map(transformFn);
      past = results.past.map(transformFn);
      return {
        recent: recent,
        past: past
      };
    });
  })
}).directive('deferSrc', function(){
  return {
    restrict: 'A',
    link: function(scope, iElement, iAttrs, controller){
      var src;
      src = iElement.attr('defer-src');
      return deferSrcSetters.push(function(){
        return iElement.attr('src', src);
      });
    }
  };
}).controller({
  EventCtrl: ['$scope', 'eventsPromise'].concat(function($scope, eventsPromise){
    return eventsPromise.then(function(events){
      var recent, past;
      recent = events.recent.map(function(it){
        it.finished = false;
        return it;
      });
      past = events.past.map(function(it){
        it.finished = true;
        return it;
      });
      return $scope.events = recent.concat(past);
    });
  })
}).controller({
  BlogCtrl: ['$scope', 'angularFireCollection', 'fireRoot'].concat(function($scope, angularFireCollection, fireRoot){
    return $scope.articles = angularFireCollection(fireRoot.child("feed/blog/articles").limit(2));
  })
}).controller({
  FeaturedCtrl: ['$scope', 'angularFireCollection'].concat(function($scope, angularFireCollection){
    var g0vhub;
    g0vhub = new Firebase("https://g0vhub.firebaseio.com/projects");
    $scope.projects = angularFireCollection(g0vhub);
    $scope.nextProject = function(){
      if ($scope.idx === void 8) {
        return;
      }
      $('#prj-img').css('opacity', 0);
      ++$scope.idx;
      return $scope.idx %= $scope.featured.length;
    };
    $scope.$watch('projects.length', function(){
      var res$, i$, ref$, len$, p;
      res$ = [];
      for (i$ = 0, len$ = (ref$ = $scope.projects).length; i$ < len$; ++i$) {
        p = ref$[i$];
        if (p.thumbnail) {
          res$.push(p);
        }
      }
      $scope.featured = res$;
      return $scope.idx = Math.floor(Math.random() * $scope.featured.length);
    });
    return $scope.$watch('idx', function(_, idx){
      if (idx !== void 8) {
        return $scope.project = $scope.featured[idx];
      }
    });
  })
}).controller({
  CommuniqueCtrl: ['$scope', '$http', '$element'].concat(function($scope, $http, $element){
    return $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/entry/all?limit=50').success(function(data, status, headers, config){
      $scope.idx = 0;
      $scope.nextCommunique = function(){
        if ($scope.idx === void 8) {
          return;
        }
        ++$scope.idx;
        return $scope.idx %= data.length;
      };
      return $scope.$watch('idx', function(_, idx){
        var i$, ref$, len$, url;
        if (idx !== void 8) {
          $scope.communique = data[idx];
        }
        for (i$ = 0, len$ = (ref$ = $scope.communique.urls).length; i$ < len$; ++i$) {
          url = ref$[i$];
          $scope.communique.content = $scope.communique.content.replace(url.name, '<a target="_blank" href="' + url.url + '">' + url.name + '</a>');
        }
        return $element.find('.description').html($scope.communique.content);
      });
    }).error(function(data, status, headers, config){
      return $scope.message = status;
    });
  })
}).controller({
  BuildIdCtrl: ['$scope'].concat(function($scope){
    var config;
    config = require('config.jsenv');
    return $scope.buildId = config.BUILD;
  })
}).controller({
  langCtrl: ['$scope', '$window'].concat(function($scope, $window){
    return $scope.changeLang = function(lang){
      var page;
      page = $window.location.pathname.split('/')[2];
      return $window.location.href = '/' + lang + '/' + page;
    };
  })
});
show = function(){
  var prjImg, h;
  prjImg = $('#prj-img');
  prjImg.animate({
    opacity: 1
  }, 500);
  h = [40 + prjImg.height()][0];
  return $('#prj-img-div').animate({
    height: h + "px"
  }, 500);
};
$(function(){
  return $('.ui.dropdown').dropdown({
    on: 'hover',
    transition: 'fade'
  });
});
({
  TITLE: 'g0v.tw',
  MENU_HOME: 'Home',
  MENU_ABOUT: 'About',
  MENU_ABOUTG0V: 'About g0v',
  MENU_MANIFESTO: '零時政府宣言',
  MENU_MEDIA: 'g0v on Media',
  MENU_BLOG: 'Blog',
  MENU_FAQ: 'FAQ',
  MENU_TRANSACTION: '收支明細',
  MENU_PROJECT: 'Project',
  MENU_LIST: '成果列表',
  MENU_PROGRESS: '開發中專案',
  MENU_HACKPAD: '開發共筆',
  MENU_OPENDATA: 'g0v Open Data Platform',
  MENU_JOIN: 'Join Us',
  MENU_HOWTO: 'How To Participate',
  MENU_TOOLS: 'Useful Tools',
  MENU_COMMUNITY: 'Community Culture',
  MENU_MEMBER: '成員入口',
  MENU_LINKS: '相關連結',
  MENU_TALKS: 'Talks',
  MENU_ACT: 'Actions',
  MENU_ACTINFO: '黑客松報名',
  MENU_ACTRECORD: '活動紀錄',
  MENU_CONTACT: 'Contact Us',
  MENU_NEWS: 'News',
  MENU_LOGBOT: 'IRC Log',
  HOME_TITLE: '零時政府 g0v.tw',
  HOME_TOPIC_LEFT: '致力推動資訊透明化，關心言論自由、資訊開放，從零重新思考政府的角色。',
  HOME_TOPIC_CENTER: '318 太陽花運動資訊彙整，包含即時影音直播、反黑箱服貿行動聲明、現場需求及相關資訊。',
  HOME_TOPIC_RIGHT: '參與者來自四方各領域，以開放原始碼的精神為基底共同協作。互相刺激，一起成長。',
  HOME_COMMUNITY: '社群動態',
  HOME_ACHIEVEMENT: '零時政府最新成果',
  HOME_BLOG: 'g0v Blog',
  HOME_NEW_EVENT: '最新活動',
  HOME_VIDEOS: '相關影片',
  HOME_CHATROOM: '即時聊天',
  HOME_ONLINE_GAME: 'Online Games',
  HOME_FACEBOOK_PAGE: 'Facebook',
  HOME_SCHEDULE: 'Calendar',
  ABOUT_TITLE: 'About Us',
  ABOUT_G0V: 'About g0v',
  MANIFESTO_TITLE: '零時政府宣言',
  MANIFESTO: '零時政府宣言',
  MEDIA_TITLE: 'g0v on Media',
  MEDIA: 'g0v on Media',
  MEDIA_FAQ: 'FAQ',
  FAQ: 'FAQ',
  TRANSACTION_TITLE: '收支明細',
  TRANSACTION: '收支明細',
  JOIN_TITLE: 'How To Participate',
  JOIN: 'How To Participate',
  TOOLS_TITLE: 'Useful Tools',
  TOOLS: 'Useful Tools',
  COMMUNITY_TITLE: 'Community Culture',
  COMMUNITY: 'Community Culture',
  LINKS_TITLE: '相關連結',
  LINKS: '零時政府相關連結',
  TALK_TITLE: 'Talks',
  TALK: 'Talks',
  ACTINFO_TITLE: 'Hackathon Registration',
  ACTINFO: 'Hackathon Registration',
  ACTRECORD_TITLE: '黑客松紀錄',
  ACTRECORD: '黑客松紀錄',
  CONTACT_TITLE: '聯繫社群',
  CONTACT_US: '聯繫社群',
  NOTFOUND_TITLE: 'Page Not Found',
  FOOTER_SOCIAL_WEB: 'Social Websites',
  FOOTER_FACEBOOK: 'Facebook',
  FOOTER_FACEBOOK_GROUP: 'Facebook Group',
  FOOTER_GOOGLE_PLUS: 'Google+',
  FOOTER_TWITTER: 'Twitter',
  FOOTER_PROJECT: 'Projects',
  FOOTER_SOURCECODE: '源碼集散地',
  FOOTER_HACKPAGE: '開發者首頁',
  FOOTER_DATACENTER: 'Data center',
  FOOTER_NEW_PROJECT: 'Create a New Project',
  FOOTER_INFO: 'Info',
  FOOTER_BLOG: 'Blog',
  BUTTON_LANG_TW: 'Chinese',
  BUTTON_LANG_EN: 'English'
});
({
  MENU_HOME: 'トップページ',
  MENU_ABOUT: '情報',
  MENU_ABOUTG0V: 'g0vについで',
  MENU_MANIFESTO: 'g0v宣言',
  MENU_MEDIA: 'メディア',
  MENU_BLOG: 'ブログ',
  MENU_FAQ: 'よくあるご質問',
  MENU_TRANSACTION: '収支計算書',
  MENU_PROJECT: 'プロジェクト',
  MENU_LIST: '成果列表',
  MENU_PROGRESS: '開発中プロジェクト',
  MENU_HACKPAD: '共同ノート',
  MENU_OPENDATA: 'g0v開放資料平臺',
  MENU_JOIN: '力になる',
  MENU_HOWTO: '参加し方',
  MENU_TOOLS: '常用工具',
  MENU_COMMUNITY: 'コミュニティ',
  MENU_MEMBER: 'メンバー',
  MENU_LINKS: '関連リンク',
  MENU_TALKS: '講演',
  MENU_ACT: 'イベント',
  MENU_ACTINFO: 'ハッカソンを申し込む',
  MENU_ACTRECORD: '過去のイベント',
  MENU_CONTACT: 'お問い合わせ',
  HOME_TITLE: '零時政府 g0v.tw',
  HOME_TOPIC_LEFT: '致力推動資訊透明化，關心言論自由、資訊開放，從零重新思考政府的角色。',
  HOME_TOPIC_CENTER: '318 太陽花運動資訊彙整，包含即時影音直播、反黑箱服貿行動聲明、現場需求及相關資訊。',
  HOME_TOPIC_RIGHT: '參與者來自四方各領域，以開放原始碼的精神為基底共同協作。互相刺激，一起成長。',
  HOME_COMMUNITY: 'SNSニュース',
  HOME_ACHIEVEMENT: '零時政府最新成果',
  HOME_BLOG: 'g0v ブログ',
  HOME_NEW_EVENT: '最新イベント',
  HOME_VIDEOS: '関連ビデオ',
  HOME_CHATROOM: 'チャットルーム',
  HOME_ONLINE_GAME: 'オンラインゲーム',
  HOME_FACEBOOK_PAGE: 'Facebookページ',
  HOME_SCHEDULE: 'スケジュール',
  ABOUT_TITLE: '我々について',
  ABOUT_G0V: 'g0vについて',
  MANIFESTO_TITLE: 'g0v宣言',
  MANIFESTO: 'g0v宣言',
  MEDIA_TITLE: 'メディア',
  MEDIA: 'メディア',
  MEDIA_FAQ: 'よくあるご質問',
  FAQ: 'よくあるご質問',
  TRANSACTION_TITLE: '収支計算書',
  TRANSACTION: '収支計算書',
  JOIN_TITLE: '参加し方',
  JOIN: '参加し方',
  TOOLS_TITLE: 'よく使うツール',
  TOOLS: 'よく使うツール',
  COMMUNITY_TITLE: '社群文化',
  COMMUNITY: '社群文化',
  LINKS_TITLE: '相關連結',
  LINKS: '零時政府相關連結',
  TALK_TITLE: '講演',
  TALK: '講演',
  ACTINFO_TITLE: 'ハッカソンを申し込み',
  ACTINFO: 'ハッカソンを申し込み',
  ACTRECORD_TITLE: 'ハッカソン記録',
  ACTRECORD: 'ハッカソン記録',
  CONTACT_TITLE: '聯繫社群',
  CONTACT_US: '聯繫社群',
  NOTFOUND_TITLE: '指定されたページが見つかりません。',
  FOOTER_SOCIAL_WEB: 'ソーシャルネットワークサイト',
  FOOTER_FACEBOOK: 'フェースブック',
  FOOTER_FACEBOOK_GROUP: 'フェースブックのグループ',
  FOOTER_GOOGLE_PLUS: 'グーグルプラス',
  FOOTER_TWITTER: 'ツイッター',
  FOOTER_PROJECT: 'プロジェクト',
  FOOTER_SOURCECODE: 'ソースコード',
  FOOTER_HACKPAGE: '開発者のホームページ',
  FOOTER_DATACENTER: 'データセンター',
  FOOTER_NEW_PROJECT: '新案を始める',
  FOOTER_INFO: '情報',
  FOOTER_BLOG: 'ブログ',
  BUTTON_LANG_TW: '正體中文',
  BUTTON_LANG_EN: 'English',
  BUTTON_LANG_JP: '日本語'
});
({
  MENU_HOME: '首頁',
  MENU_ABOUT: '關於',
  MENU_ABOUTG0V: '關於g0v',
  MENU_MANIFESTO: '零時政府宣言',
  MENU_MEDIA: '媒體報導',
  MENU_BLOG: '部落格',
  MENU_FAQ: '常見問題',
  MENU_TRANSACTION: '收支明細',
  MENU_PROJECT: '專案',
  MENU_LIST: '成果列表',
  MENU_PROGRESS: '開發中專案',
  MENU_HACKPAD: '開發共筆',
  MENU_OPENDATA: 'g0v開放資料平臺',
  MENU_JOIN: '加入行動',
  MENU_HOWTO: '如何參與',
  MENU_TOOLS: '常用工具',
  MENU_COMMUNITY: '社群文化',
  MENU_MEMBER: '成員入口',
  MENU_LINKS: '相關連結',
  MENU_TALKS: '演講資訊',
  MENU_ACT: '活動資訊',
  MENU_ACTINFO: '黑客松報名',
  MENU_ACTRECORD: '活動紀錄',
  MENU_CONTACT: '聯繫',
  MENU_NEWS: '新聞',
  MENU_LOGBOT: 'IRC紀錄',
  HOME_TITLE: '零時政府 g0v.tw',
  HOME_TOPIC_LEFT: '致力推動資訊透明化，關心言論自由、資訊開放，從零重新思考政府的角色。',
  HOME_TOPIC_CENTER: '318 太陽花運動資訊彙整，包含即時影音直播、反黑箱服貿行動聲明、現場需求及相關資訊。',
  HOME_TOPIC_RIGHT: '參與者來自四方各領域，以開放原始碼的精神為基底共同協作。互相刺激，一起成長。',
  HOME_COMMUNITY: '社群動態',
  HOME_ACHIEVEMENT: '零時政府最新成果',
  HOME_BLOG: '零時政府部落格',
  HOME_NEW_EVENT: '最新活動',
  HOME_VIDEOS: '相關影片',
  HOME_CHATROOM: '即時聊天',
  HOME_ONLINE_GAME: '線上遊戲',
  HOME_FACEBOOK_PAGE: 'fb專頁',
  HOME_SCHEDULE: '行事曆',
  ABOUT_TITLE: '關於我們',
  ABOUT_G0V: '關於零時政府',
  MANIFESTO_TITLE: '零時政府宣言',
  MANIFESTO: '零時政府宣言',
  MEDIA_TITLE: '媒體報導',
  MEDIA: '媒體報導',
  MEDIA_FAQ: '常見問題',
  FAQ: '常見問題',
  TRANSACTION_TITLE: '收支明細',
  TRANSACTION: '收支明細',
  JOIN_TITLE: '如何參與',
  JOIN: '如何參與',
  TOOLS_TITLE: '常用工具',
  TOOLS: '常用工具',
  COMMUNITY_TITLE: '社群文化',
  COMMUNITY: '社群文化',
  LINKS_TITLE: '相關連結',
  LINKS: '零時政府相關連結',
  TALK_TITLE: '演講資訊',
  TALK: '演講資訊',
  ACTINFO_TITLE: '黑客松報名',
  ACTINFO: '黑客松報名',
  ACTRECORD_TITLE: '黑客松紀錄',
  ACTRECORD: '黑客松紀錄',
  CONTACT_TITLE: '聯繫社群',
  CONTACT_US: '聯繫社群',
  NOTFOUND_TITLE: '找不到頁面',
  FOOTER_SOCIAL_WEB: '社群網站',
  FOOTER_FACEBOOK: '臉書專頁',
  FOOTER_FACEBOOK_GROUP: '臉書社群',
  FOOTER_GOOGLE_PLUS: 'G+ 專頁',
  FOOTER_TWITTER: '推特',
  FOOTER_PROJECT: '專案',
  FOOTER_SOURCECODE: '源碼集散地',
  FOOTER_HACKPAGE: '開發者首頁',
  FOOTER_DATACENTER: '資料中心',
  FOOTER_NEW_PROJECT: '新增專案',
  FOOTER_INFO: '資訊',
  FOOTER_BLOG: '部落格',
  BUTTON_LANG_TW: '中文',
  BUTTON_LANG_EN: 'English'
});