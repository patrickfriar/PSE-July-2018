function pageFix() {
    $(document).scrollTop($(".Content.Widest").offset().top)
}! function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    if (e.support.cors || !e.ajaxTransport || !window.XDomainRequest) return e;
    var t = /^(https?:)?\/\//i,
        i = /^get|post$/i,
        a = new RegExp("^(//|" + location.protocol + ")", "i");
    return e.ajaxTransport("* text html xml json", function(r, o, n) {
        if (r.crossDomain && r.async && i.test(r.type) && t.test(r.url) && a.test(r.url)) {
            var l = null;
            return {
                send: function(t, i) {
                    var a = "",
                        n = (o.dataType || "").toLowerCase();
                    l = new XDomainRequest, /^\d+$/.test(o.timeout) && (l.timeout = o.timeout), l.ontimeout = function() {
                        i(500, "timeout")
                    }, l.onload = function() {
                        var t = "Content-Length: " + l.responseText.length + "\r\nContent-Type: " + l.contentType,
                            a = {
                                code: 200,
                                message: "success"
                            },
                            r = {
                                text: l.responseText
                            };
                        try {
                            if ("html" === n || /text\/html/i.test(l.contentType)) r.html = l.responseText;
                            else if ("json" === n || "text" !== n && /\/json/i.test(l.contentType)) try {
                                r.json = e.parseJSON(l.responseText)
                            } catch (o) {
                                a.code = 500, a.message = "parseerror"
                            } else if ("xml" === n || "text" !== n && /\/xml/i.test(l.contentType)) {
                                var d = new ActiveXObject("Microsoft.XMLDOM");
                                d.async = !1;
                                try {
                                    d.loadXML(l.responseText)
                                } catch (o) {
                                    d = void 0
                                }
                                if (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) throw a.code = 500, a.message = "parseerror", "Invalid XML: " + l.responseText;
                                r.xml = d
                            }
                        } catch (s) {
                            throw s
                        } finally {
                            i(a.code, a.message, r, t)
                        }
                    }, l.onprogress = function() {}, l.onerror = function() {
                        i(500, "error", {
                            text: l.responseText
                        })
                    }, o.data && (a = "string" === e.type(o.data) ? o.data : e.param(o.data)), l.open(r.type, r.url), l.send(a)
                },
                abort: function() {
                    l && l.abort()
                }
            }
        }
    }), e
}), ! function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof module && module.exports ? require("jquery") : jQuery)
}(function(e) {
    function t(t) {
        var i = {},
            a = /^jQuery\d+$/;
        return e.each(t.attributes, function(e, t) {
            t.specified && !a.test(t.name) && (i[t.name] = t.value)
        }), i
    }

    function i(t, i) {
        var a = this,
            o = e(a);
        if (a.value == o.attr("placeholder") && o.hasClass(F.customClass))
            if (o.data("placeholder-password")) {
                if (o = o.hide().nextAll('input[type="password"]:first').show().attr("id", o.removeAttr("id").data("placeholder-id")), t === !0) return o[0].value = i;
                o.focus()
            } else a.value = "", o.removeClass(F.customClass), a == r() && a.select()
    }

    function a() {
        var a, r = this,
            o = e(r),
            n = this.id;
        if ("" === r.value) {
            if ("password" === r.type) {
                if (!o.data("placeholder-textinput")) {
                    try {
                        a = o.clone().prop({
                            type: "text"
                        })
                    } catch (l) {
                        a = e("<input>").attr(e.extend(t(this), {
                            type: "text"
                        }))
                    }
                    a.removeAttr("name").data({
                        "placeholder-password": o,
                        "placeholder-id": n
                    }).bind("focus.placeholder", i), o.data({
                        "placeholder-textinput": a,
                        "placeholder-id": n
                    }).before(a)
                }
                o = o.removeAttr("id").hide().prevAll('input[type="text"]:first').attr("id", n).show()
            }
            o.addClass(F.customClass), o[0].value = o.attr("placeholder")
        } else o.removeClass(F.customClass)
    }

    function r() {
        try {
            return document.activeElement
        } catch (e) {}
    }
    var o, n, l = "[object OperaMini]" == Object.prototype.toString.call(window.operamini),
        d = "placeholder" in document.createElement("input") && !l,
        s = "placeholder" in document.createElement("textarea") && !l,
        c = e.valHooks,
        u = e.propHooks;
    if (d && s) n = e.fn.placeholder = function() {
        return this
    }, n.input = n.textarea = !0;
    else {
        var F = {};
        n = e.fn.placeholder = function(t) {
            var r = {
                customClass: "placeholder"
            };
            F = e.extend({}, r, t);
            var o = this;
            return o.filter((d ? "textarea" : ":input") + "[placeholder]").not("." + F.customClass).bind({
                "focus.placeholder": i,
                "blur.placeholder": a
            }).data("placeholder-enabled", !0).trigger("blur.placeholder"), o
        }, n.input = d, n.textarea = s, o = {
            get: function(t) {
                var i = e(t),
                    a = i.data("placeholder-password");
                return a ? a[0].value : i.data("placeholder-enabled") && i.hasClass(F.customClass) ? "" : t.value
            },
            set: function(t, o) {
                var n = e(t),
                    l = n.data("placeholder-password");
                return l ? l[0].value = o : n.data("placeholder-enabled") ? ("" === o ? (t.value = o, t != r() && a.call(t)) : n.hasClass(F.customClass) ? i.call(t, !0, o) || (t.value = o) : t.value = o, n) : t.value = o
            }
        }, d || (c.input = o, u.value = o), s || (c.textarea = o, u.value = o), e(function() {
            e(document).delegate("form", "submit.placeholder", function() {
                var t = e("." + F.customClass, this).each(i);
                setTimeout(function() {
                    t.each(a)
                }, 10)
            })
        }), e(window).bind("beforeunload.placeholder", function() {
            e("." + F.customClass).each(function() {
                this.value = ""
            })
        })
    }
});
var FormField = {
        GetField: function(e) {
            if (isNaN(e) && "object" == typeof e && (e = parseInt($(e).attr("id").substr(10))), "" == e || isNaN(e)) return !1;
            var t = $("#FormField_" + e),
                i = $(t).length;
            return 0 == i ? !1 : (i > 1 && (t = $(t).get(i - 1)), $(t))
        },
        GetFieldByPrivateId: function(e, t) {
            if (isNaN(e) || 1 > e || "" == t) return !1;
            var i = $(".FormFieldPrivateId[value=" + t + "]").parent("*:has(.FormFieldFormId[value=" + e + "])").find(".FormField");
            return i.length ? i[0] : !1
        },
        GetFieldByLabel: function(e, t) {
            if (isNaN(e) || 1 > e || "" == t) return !1;
            var i = !1;
            return $(".FormField").each(function() {
                FormField.GetFieldFormId(this) == e && FormField.GetLabel(this) == t && (i = $(this))
            }), i
        },
        GetFieldType: function(e) {
            var t = FormField.GetFieldDefinitionData(e);
            return t ? $(".FormFieldType", t).val() : ""
        },
        GetFieldId: function(e) {
            var t = FormField.GetFieldDefinitionData(e);
            return t ? $(".FormFieldId", t).val() : ""
        },
        GetFieldFormId: function(e) {
            var t = FormField.GetFieldDefinitionData(e);
            return t ? $(".FormFieldFormId", t).val() : ""
        },
        GetSelectorChoosePrefix: function(e) {
            var t = FormField.GetFieldDefinitionData(e);
            return t && $(".FormFieldChoosePrefix", t).length ? $(".FormFieldChoosePrefix", t).val() : ""
        },
        GetFieldPrivateId: function(e) {
            var t = FormField.GetFieldDefinitionData(e);
            return t ? $(".FormFieldPrivateId", t).val() : ""
        },
        GetFieldDefinitionData: function(e) {
            var t = $(e).parents("dd");
            return t.length || (t = $(e).parent("div.value")), t.length ? t : !1
        },
        GetFieldDefinitionTag: function(e) {
            var t = FormField.GetFieldDefinitionData(e);
            if (!t) return !1;
            var i = t.prev("dt");
            return i.length || (i = t.prev("label")), i ? i : !1
        },
        GetValue: function(e) {
            var t = FormField.GetField(e);
            if (!t) return "";
            switch (FormField.GetFieldType(t).toLowerCase()) {
                case "radioselect":
                case "checkboxselect":
                    var i = [];
                    return $(".FormFieldOption:checked", t).each(function() {
                        i[i.length] = $(this).val()
                    }), 0 == i.length ? "radioselect" == FormField.GetFieldType(t).toLowerCase() ? "" : [] : ("radioselect" == FormField.GetFieldType(t).toLowerCase() && (i = i[0]), i);
                case "datechooser":
                    var a = $(".FormFieldDay", t).val(),
                        r = $(".FormFieldMonth", t).val(),
                        o = $(".FormFieldYear", t).val();
                    return "" == a || "" == r || "" == o ? "" : (1 == a.length && (a = "0" + a), 1 == r.length && (r = "0" + r), o + "-" + r + "-" + a);
                default:
                    return $(t).val()
            }
        },
        GetValues: function(e, t) {
            var i = [];
            ("undefined" == typeof t || t !== !0) && (t = !1), isNaN(e) || (e = [e]);
            for (var a = e.length; a--;) {
                var r = e[a];
                $(".FormFieldFormId[value=" + r + "]").parent("dd, div.value").find(".FormField").each(function() {
                    if (!t || "" != FormField.GetFieldPrivateId(this))
                        for (var a = 0; a < e.length; a++) i[i.length] = {
                            field: $(this),
                            fieldId: FormField.GetFieldId(this),
                            formId: r,
                            privateId: FormField.GetFieldPrivateId(this),
                            label: FormField.GetLabel(this),
                            value: FormField.GetValue(this)
                        }
                })
            }
            return i
        },
        SetValue: function(e, t, i) {
            var a = FormField.GetField(e);
            if (!a) return !1;
            switch ("undefined" == typeof i && (i = {}), FormField.GetFieldType(a).toLowerCase()) {
                case "selectortext":
                    if ("undefined" == typeof i.display && (i.display = "select"), i.display != a.get(0).tagName.toLowerCase()) {
                        if ("select" == i.display) var r = $("<select />");
                        else var r = $('<input type="text" />');
                        if ($(r).attr("name", $(a).attr("name")), $(r).attr("class", $(a).attr("class")), $(r).attr("id", $(a).attr("id")), $(r).attr("style", $(a).attr("style")), $(a).replaceWith(r), "select" !== i.display) {
                            var e = FormField.GetFieldId(e),
                                o = FormField.GetFieldFormId(e);
                            $(r).after('<input type="hidden" name="FormFieldIsText[' + o + "][" + e + ']" value="1" />')
                        }
                    } else var r = a;
                    "undefined" != typeof i.options && FormField.SetOptions(e, i.options), $(r).val(t);
                    break;
                case "radioselect":
                case "checkboxselect":
                    "undefined" != typeof i.options && FormField.SetOptions(e, i.options), "string" == typeof t ? t = [t] : "radioselect" == FormField.GetFieldType(a).toLowerCase() && t.length > 1 && (t.length = 1), $(".FormFieldOption", a).each(function() {
                        for (var e = !1, i = 0; i < t.length; i++)
                            if ($(this).attr("value") == t[i]) {
                                e = !0;
                                break
                            }
                        $(this).attr("checked", e)
                    });
                    break;
                case "datechooser":
                    if (-1 == t.indexOf("-")) return !1;
                    var n = t.split("-");
                    if (3 !== n.length) return !1;
                    var l = parseInt(n[0], 10),
                        d = parseInt(n[1], 10),
                        s = parseInt(n[2], 10);
                    if (isNaN(s) || isNaN(d) || isNaN(l)) return !1;
                    $(".FormFieldYear", a).val(l), $(".FormFieldMonth", a).val(d), $(".FormFieldDay", a).val(s);
                    break;
                default:
                    "singleselect" == FormField.GetFieldType(a).toLowerCase() && "undefined" != typeof i.options && FormField.SetOptions(e, i.options), $(a).val(t)
            }
        },
        SetValueByIndex: function(e, t, i) {
            var a = FormField.GetField(e);
            if (!a) return !1;
            if ("checkboxselect" !== FormField.GetFieldType(a).toLowerCase() || "radioselect" == FormField.GetFieldType(a).toLowerCase()) return !0;
            if ("object" != typeof t && (t = [t]), 0 == t.length) return !0;
            "undefined" == typeof i && (i = !0), i = i !== !0 ? !1 : !0;
            var r = 0;
            $("input", a).each(function() {
                for (var e = 0; e < t.length; e++)
                    if (t[e] == r) {
                        $(this).attr("checked", i);
                        break
                    }
                r++
            })
        },
        GetOptions: function(e, t) {
            var i = FormField.GetField(e);
            if (!i) return !1;
            switch (("undefined" == typeof t || t !== !0) && (t = !1), FormField.GetFieldType(i).toLowerCase()) {
                case "selectortext":
                case "singleselect":
                    if ("input" == $(i).get(0).tagName) return [];
                    var a = [];
                    return $("option", i).each(function() {
                        "" !== $(this).val() && (a[a.length] = $(this).val())
                    }), a;
                case "radioselect":
                case "checkboxselect":
                    var a = [];
                    return $("input", i).each(function() {
                        "" !== $(this).val() && (a[a.length] = $(this).val())
                    }), a;
                default:
                    return []
            }
        },
        SetOptions: function(e, t) {
            var i = FormField.GetField(e);
            if (!i) return !1;
            switch ("string" == typeof t && (t = [t]), FormField.GetFieldType(i).toLowerCase()) {
                case "selectortext":
                case "singleselect":
                    var a = FormField.GetSelectorChoosePrefix(i);
                    $(i).empty(), "" !== a && $(i).append('<option value="">' + a + "</option>");
                    for (var r = 0; r < t.length; r++) $(i).append('<option value="' + t[r] + '">' + t[r] + "</option>");
                    break;
                case "radioselect":
                case "checkboxselect":
                    i.empty();
                    var o = $(select).attr("id"),
                        n = $(select).attr("name");
                    if ("radioselect" == FormField.GetFieldType(i).toLowerCase()) var l = '<input type="radio" />';
                    else var l = '<input type="checkbox" />';
                    for (var r = 0; r < t.length; r++) {
                        r > 0 && $(select).append("<br>");
                        var d = $(select).append("<label>");
                        $(d).attr("for", o + "_" + r);
                        var s = $(d).append(l);
                        $(s).attr("id", o + "_" + r), $(s).attr("name", n + "_[" + r + "]"), $(s).val(t[r]), $(d).append(" " + t[r])
                    }
            }
        },
        GetLabel: function(e) {
            var t = FormField.GetFieldDefinitionTag(e);
            if (!t) return !1;
            var i = $(".FormFieldLabel", t).text();
            return i = i.replace(/:/, "")
        },
        IsRequired: function(e) {
            var t = FormField.GetFieldDefinitionTag(e);
            if (!t) return !1;
            var i = $(".FormFieldRequired", t);
            return "hidden" == $(i).css("visibility") ? !1 : !0
        },
        SetRequired: function(e, t) {
            var i = FormField.GetField(e);
            if (dt = FormField.GetFieldDefinitionTag(i), !dt) return !1;
            var a = $(".FormFieldRequired", dt);
            return ("undefined" == typeof t || t !== !0) && (t = !1), t ? $(a).css("visibility", "visible") : $(a).css("visibility", "hidden"), !0
        },
        SetDisabled: function(e, t) {
            if (e = FormField.GetField(e), !e) return !1;
            switch (("undefined" == typeof t || t !== !0) && (status = !1), FormField.GetFieldType(e).toLowerCase()) {
                case "radioselect":
                case "checkboxselect":
                    $("input", e).each(function() {
                        $(this).attr("disabled", t)
                    });
                    break;
                default:
                    $(e).attr("disabled", t)
            }
            return !0
        },
        BindEvent: function(e, t, i, a) {
            if (e = FormField.GetField(e), !e || "undefined" == typeof t || "" == t || "function" != typeof i) return !1;
            switch ("undefined" == typeof a && (a = {
                fieldId: FormField.GetFieldId(e)
            }), FormField.GetFieldType(e).toLowerCase()) {
                case "radioselect":
                case "checkboxselect":
                    $("input", e).each(function() {
                        $(this).bind(t, a, i)
                    });
                    break;
                default:
                    $(e).bind(t, a, i)
            }
            return !0
        },
        UnBindEvent: function(e, t, i) {
            if (e = FormField.GetField(e), !e || "undefined" == typeof t || "" == t) return !1;
            switch (FormField.GetFieldType(e).toLowerCase()) {
                case "radioselect":
                case "checkboxselect":
                    $("input", e).each(function() {
                        $(this).unbind(t, i)
                    });
                    break;
                default:
                    $(e).unbind(t, i)
            }
            return !0
        },
        Focus: function(e) {
            if (e = FormField.GetField(e)) {
                var t = null,
                    i = !0;
                switch (FormField.GetFieldType(e).toLowerCase()) {
                    case "radioselect":
                    case "checkboxselect":
                        t = $("input:first", e), i = !1;
                        break;
                    case "datechooser":
                        t = $(".FormFieldMonth", e);
                        break;
                    default:
                        t = e
                }
                null != t && (i && $(t).select(), $(t).focus())
            }
        },
        Hide: function(e) {
            var t = FormField.GetFieldDefinitionData(e),
                i = FormField.GetFieldDefinitionTag(e);
            return t && i ? ($(t).hide(), void $(i).hide()) : !1
        },
        Show: function(e) {
            var t = FormField.GetFieldDefinitionData(e),
                i = FormField.GetFieldDefinitionTag(e);
            return t && i ? ($(t).show(), void $(i).show()) : !1
        },
        Validate: function(e) {
            if (e = FormField.GetField(e), !e) return !1;
            var t = {
                    status: !0,
                    msg: ""
                },
                i = FormField.GetValue(e),
                a = FormField.GetFieldType(e).toLowerCase();
            if (FormField.IsRequired(e) && "" == i && ("selectortext" == a && $(e).attr("type") && "text" == $(e).attr("type").toLowerCase() || "password" == a || ("checkboxselect" == a || "radioselect" == a ? t.msg = lang.CustomFieldsValidationOptionRequired : t.msg = lang.CustomFieldsValidationRequired)), "" == t.msg) switch (a) {
                case "numberonly":
                    if (isNaN(i)) t.msg = lang.CustomFieldsValidationNumbersOnly;
                    else {
                        var r = FormField.GetFieldDefinitionData(e),
                            o = $(".FormFieldLimitFrom", r),
                            n = $(".FormFieldLimitTo", r);
                        $(o).length > 0 && parseInt(i, 10) < parseInt($(o).val(), 10) ? (t.msg = lang.CustomFieldsValidationNumbersToLow, t.msg = t.msg.replace(/%d/, $(o).val())) : $(n).length > 0 && parseInt(i, 10) > parseInt($(n).val(), 10) && (t.msg = lang.CustomFieldsValidationNumbersToHigh, t.msg = t.msg.replace(/%d/, $(n).val()))
                    }
                    break;
                case "datechooser":
                    var l = $(".FormFieldDay", e).val(),
                        d = $(".FormFieldMonth", e).val(),
                        s = $(".FormFieldYear", e).val();
                    l + "" + d + s == "" || "" != l && "" != d && "" != s || (t.msg = lang.CustomFieldsValidationDateInvalid);
                    var r = FormField.GetFieldDefinitionData(e),
                        o = $(".FormFieldLimitFrom", r),
                        n = $(".FormFieldLimitTo", r);
                    if (0 == $(o).length || 0 == $(n).length) break;
                    var c = i.split("-"),
                        u = $(o).val().split("-"),
                        F = $(n).val().split("-");
                    jQuery.each(c, function(e) {
                        c[e] = parseInt(c[e], 10)
                    }), jQuery.each(u, function(e) {
                        u[e] = parseInt(u[e], 10)
                    }), jQuery.each(F, function(e) {
                        F[e] = parseInt(F[e], 10)
                    });
                    var p = new Date(c[0], c[1] - 1, c[2]),
                        f = new Date(u[0], u[1] - 1, u[2]),
                        m = new Date(F[0], F[1] - 1, F[2]);
                    p.getTime() < f.getTime() ? (t.msg = lang.CustomFieldsValidationDateToLow, t.msg = t.msg.replace(/%s\./, f.toLocaleDateString() + ".")) : p.getTime() > m.getTime() && (t.msg = lang.CustomFieldsValidationDateToHigh, t.msg = t.msg.replace(/%s\./, m.toLocaleDateString() + "."));
                    break;
                case "password":
                    if (FormField.IsRequired(e))
                        if ("text" == $(e).attr("type") && "" == i) t.msg = lang.CustomFieldsValidationRequired;
                        else {
                            var r = FormField.GetFieldDefinitionData(e),
                                h = $(".FormFieldAlreadySet", r);
                            0 != $(h).length && "" != $(h).val() || "" != i || (t.msg = lang.CustomFieldsValidationRequired)
                        }
            }
            return "" !== t.msg && (t.msg = t.msg.replace(/'%s'/, "'" + FormField.GetLabel(e) + "'"), t.status = !1), t
        }
    },
    FormFieldEvent = {
        SingleSelectPopulateStates: function(e) {
            var t = e.data.countryId,
                i = FormField.GetValue(t),
                a = e.data.stateId,
                r = "",
                o = !1;
            if ("undefined" != typeof e.data.selectedState && (r = e.data.selectedState), "undefined" != typeof e.data.inOrdersAdmin && (o = e.data.inOrdersAdmin), "" == i) {
                var n = {
                    display: "option"
                };
                return void FormField.SetValue(a, "", n)
            }
            $.ajax({
                url: "remote.php",
                type: "post",
                data: {
                    w: "getStates",
                    countryName: i
                },
                success: function(e) {
                    if ("0" != $("status", e).text()) {
                        var t = [];
                        if ($("options option", e).each(function() {
                                t[t.length] = $("name", this).text()
                            }), 0 == t.length) {
                            var i = {
                                display: "option"
                            };
                            FormField.SetRequired(a, !1)
                        } else {
                            var i = {
                                display: "select",
                                options: t
                            };
                            FormField.SetRequired(a, !0)
                        }
                        if (FormField.SetValue(a, r, i), o && "undefined" != typeof OrderManager) {
                            var n = {
                                data: {
                                    fieldId: a
                                }
                            };
                            OrderManager.BindAddressSyncEventsCallback(n)
                        }
                    }
                }
            })
        },
        CheckBoxShipToAddress: function(e) {
            "undefined" != typeof e.data.fieldId && (FormField.GetValue(e.data.fieldId).length > 0 ? ($(".billingButton").val(lang.BillAndShipToAddress), $(".shippingButton").val(lang.ShipToThisAddress), $("#ship_to_billing_existing").attr("checked", !0)) : ($(".billingButton").val(lang.BillToThisAddress), $(".shippingButton").val(lang.ShipToThisAddress), $("#ship_to_billing_existing").attr("checked", !1)))
        }
    };
$(document).ready(function() {
    $(".FormField.JSHidden").show()
}), $(document).ready(function() {}), $(document).ready(function() {
    $("#FormField_11, #FormField_21").live("change", function() {
        $.uniform.restore("select.JSHidden")
    })
}), $(document).ajaxComplete(function(e, t, i) {
    $("select").not(".UniApplied").uniform(), $("input[type=checkbox], input[type=radio]").not(".UniApplied").uniform()
}), $(window).load(function() {
    $("select").not(".UniApplied").uniform(), $(".sideCartMessage").text($(".InfoMessage").first().text().trim()), $(".InfoMessage").first().hide()
});