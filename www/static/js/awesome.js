// awesome.js

function showError(err) {
    var alert = $('div.uk-alert-danger');
    if (err) {
        alert.text(err.message || err.error || err).removeClass('uk-hidden').show();
        try {
            if (alert.offset().top < ($(window).scrollTop() - 41)) {
                $('html,body').animate({scrollTop: alert.offset().top - 41});
            }
        }
        catch (e) {}
    }
    else {
        alert.addClass('uk-hidden').hide().text('');
    }
}

function _ajax(method, url, data, callback) {
    $.ajax({
        type: method,
        url: url,
        data: data,
        dataType: 'json'
    }).done(function(r) {
        if (r && r.error) {
            return callback && callback(r);
        }
        return callback && callback(null, r);
    }).fail(function(jqXHR, textStatus) {
        return callback && callback({error: 'HTTP ' + jqXHR.status, message: 'Network error (HTTP ' + jqXHR.status + ')'});
    });
}

function getApi(url, data, callback) {
    if (arguments.length === 2) {
        callback = data;
        data = {};
    }
    _ajax('GET', url, data, callback);
}

function postApi(url, data, callback) {
    if (arguments.length === 2) {
        callback = data;
        data = {};
    }
    _ajax('POST', url, data, callback);
}

function startLoading() {
    var btn = $('form').find('button[type=submit]');
    var icon = btn.find('i');
    icon.addClass('uk-icon-spinner').addClass('uk-icon-spin');
    btn.attr('disabled', 'disabled');
}

function stopLoading() {
    var btn = $('form').find('button[type=submit]');
    var icon = btn.find('i');
    icon.removeClass('uk-icon-spin').removeClass('uk-icon-spinner');
    btn.removeAttr('disabled');
}

// add to prototype:

if (! String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

if (! Number.prototype.toDateTime) {
    var replaces = {
        'yyyy': function(dt) {
            return dt.getFullYear().toString();
        },
        'yy': function(dt) {
            return (dt.getFullYear() % 100).toString();
        },
        'MM': function(dt) {
            var m = dt.getMonth() + 1;
            return m < 10 ? '0' + m : m.toString();
        },
        'M': function(dt) {
            var m = dt.getMonth() + 1;
            return m.toString();
        },
        'dd': function(dt) {
            var d = dt.getDate();
            return d < 10 ? '0' + d : d.toString();
        },
        'd': function(dt) {
            var d = dt.getDate();
            return d.toString();
        },
        'hh': function(dt) {
            var h = dt.getHours();
            return h < 10 ? '0' + h : h.toString();
        },
        'h': function(dt) {
            var h = dt.getHours();
            return h.toString();
        },
        'mm': function(dt) {
            var m = dt.getMinutes();
            return m < 10 ? '0' + m : m.toString();
        },
        'm': function(dt) {
            var m = dt.getMinutes();
            return m.toString();
        },
        'ss': function(dt) {
            var s = dt.getSeconds();
            return s < 10 ? '0' + s : s.toString();
        },
        's': function(dt) {
            var s = dt.getSeconds();
            return s.toString();
        },
        'a': function(dt) {
            var h = dt.getHours();
            return h < 12 ? 'AM' : 'PM';
        }
    };
    var token = /([a-zA-Z]+)/;
    Number.prototype.toDateTime = function(format) {
        var fmt = format || 'yyyy-MM-dd hh:mm'
        var dt = new Date(this * 1000);
        var arr = fmt.split(token);
        for (var i=0; i<arr.length; i++) {
            var s = arr[i];
            if (s && s in replaces) {
                arr[i] = replaces[s](dt);
            }
        }
        return arr.join('');
    };
}

function gotoPage(index) {
    if (index) {
        var search = location.search;
        var hasPageParam = search.search(/page\=\d+\&?/)!==(-1);
        if (hasPageParam) {
            search = search.replace(/page\=\d+\&?/g, '');
        }
        search = (search==='' || search==='?') ? ('?page=' + index) : (search + '&page=' + index);
        location.assign(search);
    }
}

function showConfirm(title, text, fn_ok, fn_cancel) {
    var s = '<div id="div-confirm" class="uk-modal">' +
            '<div class="uk-modal-dialog">' +
            '<a href="#0" class="uk-modal-close uk-close"></a>' +
            '<h1 class="x-title"></h1>' +
            '<p class="x-text"></p>' +
            '<hr><p class="uk-text-center">' +
            '<button class="uk-button uk-button-primary x-ok"><i class="uk-icon-check"></i> 是</button>' +
            '&nbsp;&nbsp;&nbsp;' +
            '<button class="uk-button x-cancel"><i class="uk-icon-times"></i> 否</button>' +
            '</p></div></div>';
    $('body').append(s);
    var m = $('#div-confirm');
    var modal = new $.UIkit.modal.Modal('#div-confirm');
    m.find('.x-title').text(title);
    m.find('.x-text').text(text);
    m.find('.x-ok').click(function () {
        modal.hide();
        fn_ok && fn_ok();
    });
    m.find('.x-cancel').click(function () {
        modal.hide();
        fn_cancel && fn_cancel();
    });
    m.on({
        'uk.modal.hide': function() {
            $('#div-confirm').remove();
        }
    });
    modal.show();
}

$(function() {
    if (location.pathname === '/' || location.pathname.indexOf('/blog')===0) {
        $('li[data-url=blogs]').addClass('uk-active');
    }
});
