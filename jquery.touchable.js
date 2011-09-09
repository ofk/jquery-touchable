/**
 * @fileOverview
 *   タッチ端末の場合、マウスイベントをタッチイベントに書き換えるプラグイン。
 * @author <a href="http://0fk.org/">ofk</a>
 * @version 0.2
 * @license
 *   jquery.touchable.js (c) 2011 ofk
 *   Released under the MIT License.
 */

(function (jQuery) {

//@vars

// タッチイベントが存在しない。
if (!('ontouchstart' in window)) {
	return;
}

var	// イベントを付与するときに使う。
	prefix = '*touchable*',
	// マウスイベントをタッチイベントに変換する。
	touchToMouse = {
		touchstart: [ 'mousedown', function (event) {
			// オリジナルイベントを取得する。
			var originalEvent = event.originalEvent;
			// タッチイベントではない。
			if (!originalEvent || !originalEvent.touches) {
				return;
			}
			var touches = originalEvent.touches;
			// 一本ではない指が触れている。
			if (touches.length !== 1) {
				return;
			}
			// イベントを上書きする。
			arguments[0] = event = new jQuery.Event('mousedown', touches[0]);
			event.originalEvent = originalEvent;
			jQuery.data(this, prefix + 'identifier', touches[0].identifier);
			jQuery.data(this, prefix + event.type, event);
			// イベントを実行する。
			jQuery.event.handle.apply(this, arguments);
		} ],
		touchmove: [ 'mousemove', function (event) {
			// オリジナルイベントを取得する。
			var originalEvent = event.originalEvent;
			// タッチイベントではない。
			if (!originalEvent || !originalEvent.touches) {
				return;
			}
			var touches = originalEvent.touches;
			// 指が触れていない。
			if (!touches.length) {
				return;
			}
			// 適切な指を探索する。
			var index = -1,
			    identifier = jQuery.data(this, prefix + 'identifier');
			for (var i = 0, iz = touches.length; i < iz; ++i) {
				if (touches[i].identifier === identifier) {
					index = i;
					break;
				}
			}
			if (index === -1) {
				return;
			}

			// イベントを上書きする。
			arguments[0] = event = new jQuery.Event('mousemove', touches[index]);
			event.originalEvent = originalEvent;
			jQuery.data(this, prefix + event.type, event);
			// イベントを実行する。
			jQuery.event.handle.apply(this, arguments);
		} ],
		touchend: [ 'mouseup', function (event) {
			// オリジナルイベントを取得する。
			var originalEvent = event.originalEvent;
			// タッチイベントではない。
			if (!originalEvent || !originalEvent.touches) {
				return;
			}
			var touches = originalEvent.touches;
			// 指が残っているか探索する。
			var identifier = jQuery.data(this, prefix + 'identifier');
			for (var i = 0, iz = touches.length; i < iz; ++i) {
				if (touches[i].identifier === identifier) {
					return; //< 残っている。
				}
			}

			// イベントを上書きする。
			arguments[0] = event = jQuery.data(this, prefix + 'mousemove')
			                    || jQuery.data(this, prefix + 'mousedown')
			                    || event;
			event.type = 'mouseup';
			event.originalEvent = originalEvent;
			// イベントキャッシュを削除する。
			jQuery.removeData(this, prefix + 'mousemove');
			jQuery.removeData(this, prefix + 'mousedown');
			jQuery.removeData(this, prefix + 'identifier');
			// イベントを実行する。
			jQuery.event.handle.apply(this, arguments);
		} ]
	};

// マウスイベントをタッチイベントに置き換える。
jQuery.each(touchToMouse, function (fix, orig) {
	jQuery.event.special[orig[0]] = {
		setup: function () {
			jQuery.event.add(this, fix, orig[1]);
		},
		teardown: function () {
			jQuery.event.remove(this, fix, orig[1]);
		}
	};
});

}(jQuery));
