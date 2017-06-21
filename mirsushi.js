var CONFIRM_TIMER = 30;
var remainTime=0;
var timeinterval="";
var currentOrderStatusTimeInterval="";
var $body = $("html");
var ms = {
    $loader: null,
    modals: {
        $randomModal: null,
        $loginModal: null,
        $loginConfirmModal: null,
        $registerModal: null,
        $registerConfirmModal: null,
        $registerThanksmModal: null,
        $filterModal: null,
        $giftsModal: null,
        $errorModal: null,
        $orderConfirmModal: null,
        $commentModal: null,
        $commentModalThanks: null,
        $promoModal: null,
        $promoModalThanks: null,
        $yourCode: null,
        $yourCodeAlias: null,
        $endOrdersModal: null,
        $cartItemModal: null,
        $infoModal: null
    },
    forms: {
        $catalogFilterForm: null,
        $cartStepOneForm: null,
        $cartStepTwoForm: null
    },
    url: {
        api: "/s",
        getProduct: "/get-product.json",
        getGroupProduct: "/get-group-product.json",
        getProducts: "/get-products.json",
        getNewsItem: "/get-news-item.json",
        getActionItem: "/get-action-item.json",
        sendTestimonial: "/send-testimonial.json",
        sendCallback: "/send-callback.json",
        sendFAQ: "/send-faq.json",
        getSurprise: "/get-surprise.json",
        addToCart: "/add-to-cart.json",
        addGiftToCart: "/add-gift-to-cart.json",
        getRegistrationConfirmCode: "/get-registration-confirm-code.json",
        confirmRegistration: "/confirm-registration.json",
        getLoginConfirmCode: "/get-login-confirm-code.json",
        confirmLogin: "/confirm-login.json",
        getStreets: "/get-streets.json",
        newAddress: "/new-address.json",
        updateAccountProfile: "/update-account-profile.json",
        getCartStepOne: "/get-cart-step-one.json",
        checkCartStepOne: "/check-cart-step-one.json",
        checkCartStepTwo: "/check-cart-step-two.json",
        increaseCartItem: "/increase-cart-item.json",
        decreaseCartItem: "/decrease-cart-item.json",
        removeCartItem: "/remove-cart-item.json",
        setCartItem: "/set-cart-item.json",
        increaseCartToppingItem: "/increase-cart-topping-item.json",
        decreaseCartToppingItem: "/decrease-cart-topping-item.json",
        setCartTopingItem: "/set-cart-toping-item.json",
        increaseCartFlatwareItem: "/increase-cart-flatware-item.json",
        decreaseCartFlatwareItem: "/decrease-cart-flatware-item.json",
        setCartFlatwareItem: "/set-cart-flatware-item.json",
        clearCart: "/clear-cart.json",
        repeatOrder: "/repeat-order.json",
        getDeliveryDates: "/get-delivery-dates.json",
        getDeliveryTimes: "/get-delivery-times.json",
        getDeliveryCost: "/get-delivery-cost.json",
        orderConfirm: "/order-confirm.json",
        activatePromo: "/activate-promo.json",
        getOrderTimer: "/get-order-timer.json",
        getCurrentOrderStatusTimer: "/get-current-order-status-timer.json",
        getBlockingTV: "/getblocking.json",
        sendTestimonialMail: "/send-testimonial-mail.json",
        commentsShowElse: "/get-comments-else.json",
        sendFriendPhone: "/send-friend-phone.json"
    },
    init: function () {
        this.$loader = $(".preloader-box");
        this.modals.$randomModal = $("#random-modal");
        this.modals.$registerModal = $("#register");
        this.modals.$registerConfirmModal = $("#register-confirm");
        this.modals.$registerThanksmModal = $("#thx-register");
        this.modals.$loginModal = $("#login");
        this.modals.$loginConfirmModal = $("#login-confirm");
        this.modals.$filterModal = $("#filter-modal");
        this.modals.$giftsModal = $("#gift-modal");
        this.modals.$errorModal = $("#error-common");
        this.modals.$orderConfirmModal = $("#order-confirm");
        this.modals.$commentModal = $("#comment");
        this.modals.$commentModalThanks = $("#thx-comment");
        this.modals.$promoModal = $("#promo-modal");
        this.modals.$promoModalThanks = $("#thx-promo");
        this.forms.$catalogFilterForm = $("#catalog-filter-form");
        this.forms.$cartStepOneForm = $("#cart-step-one-form");
        this.forms.$cartStepTwoForm = $("#cart-step-two-form");
        this.modals.$yourCode = $("#your-code-modal");
        this.modals.$endOrdersModal = $("#orders-end-modal");
        this.modals.$yourCodeAlias = "vash-lichnyij-kod";
        this.modals.$cartItemModal = $("#cart-item-modal");
        this.modals.$infoModal = $("#info-common");
        this.setDefaultCity();
        if ($(".side-nav .timer").size()) {
            this.getOrderTimer();
        }
        if ($(".cabinet-header").size()) {
            currentOrderStatusTimeInterval = setInterval(function(){ms.getCurrentOrderStatusTimer()}, 5*60*1000);
            if ($("#order_delivered").hasClass("active")) {
                clearInterval(currentOrderStatusTimeInterval);
            }
        }
    },
    showErrorModal: function (text, modal) {
        if (!ms.modals.$errorModal.hasClass("opened")) {
            $(".modal").modal("hide");
            ms.modals.$errorModal.addClass("opened");
            if (modal) {
                ms.modals.$errorModal.find("button").attr("data-toggle", "modal");
                ms.modals.$errorModal.find("button").attr("data-target", "#" + modal);
                if (modal == "login") {
                    ms.modals.$loginModal.find("#uLogin").remove();
                }
            }
            ms.modals.$errorModal.find(".thx-modal-text").text(text);
            ms.modals.$errorModal.modal("show");
        }
    },
    clearFormInput: function ($container) {
        $container.find(":input").not(":button, :submit, :reset, :hidden").val("").removeAttr("checked").removeAttr("selected");
        $container.find(".has-error").removeClass("has-error");
    },
    supportLocalStorage: function () {
        var test = "mirsushi";
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },
    setDefaultCity: function () {
        if (ms.supportLocalStorage()) {
            var link = localStorage.getItem("startCityLink");
            var $button = $(".js-choose-city");
            $button.attr("href", link);
            $button.parents(".starter-page-container-box").find('option[value="' + link + '"]').attr("selected", "selected");
        }
    },
    loaderShow: function () {
        ms.$loader.fadeIn(100);
    },
    loaderHide: function () {
        ms.$loader.fadeOut(100);
    },

    getProduct: function ($button) {
        if (ms.modals.$randomModal.length > 0) {
            ms.modals.$randomModal.modal("hide");
        }
        var $modalContent = $("#cart-item-modal").find(".modal-content");
        //$modalContent.html("");
        var itemId = $button.data("item-id");
        var bestseller = $button.data("bestseller");
        var surprise = $button.data("surprise");
        var action_type = $button.data("action-type");
        var action_id = $button.data("action-id");
        var data = {
            item_id: itemId,
            bestseller: bestseller,
            surprise: surprise,
            action_type: action_type,
            action_id: action_id
        };
        $.get(ms.url.api + ms.url.getProduct, data, function (response) {
            if (response.html) {
                $modalContent.hide(200, function (){
                    $modalContent.html(response.html);
                });
                $modalContent.show(200);
                var link = window.location.protocol + "//" + window.location.hostname + "/" + $button.attr("href");
                window.history.pushState("", null, link);
            }
        }, "json");
    },
    sendTestimonial: function ($form) {
        var request = new FormData();
        var $testimonialFile = $("#testimonial_file");
        if ($testimonialFile.length > 0) {
            $.each($testimonialFile[0].files, function (i, file) {
                request.append("testimonial_file[]", file);
            });
        }
        request.append("testimonial_text", $("#testimonial_text").val());
        request.append("testimonial_email", $("#testimonial_email").val());
        $.ajax({
            url: ms.url.api + ms.url.sendTestimonial,
            data: request,
            processData: false,
            contentType: false,
            type: "post",
            success: function (response) {
                if (response.result == "success") {
                    ms.clearFormInput(ms.modals.$commentModal);
                    ms.modals.$commentModal.find(".file_upload").find("button").text("Прикрепить файл");
                    ms.modals.$commentModalThanks.modal("show");
                    ms.sendTestimonialMail(response.mail);
                }
                if (response.result == "error" && response.errors) {
                    if (typeof response.errors === "string") {
                        ms.showErrorModal(response.errors);
                    } else {
                        $.each(response.errors, function (key, value) {
                            $("#" + value).parents(".form-group").addClass("has-error");
                        });
                    }
                }
                var $button = $form.find("button");
                $button.removeAttr("disabled");
            }
        });
        ms.modals.$commentModal.modal("hide");
    },
    sendTestimonialMail: function(mail) {
        $.post(ms.url.api + ms.url.sendTestimonialMail, mail);
    },

    getNews: function ($button) {
        var itemId = $button.data("item-id");
        $.get(ms.url.api + ms.url.getNewsItem, {
            item_id: itemId
        }, function (response) {
            if (response.html) {
                $("#news-modal").find(".modal-content").html(response.html);
                var link = window.location.protocol + "//" + window.location.hostname + "/" + $button.attr("href");
                window.history.pushState("", null, link);
            }
        }, "json");
    },
    getAction: function ($button) {
        var itemId = $button.data("item-id");
        $.get(ms.url.api + ms.url.getActionItem, {
            item_id: itemId
        }, function (response) {
            if (response.html) {
                $("#stock-modal").find(".modal-content").html(response.html);
                var link = window.location.protocol + "//" + window.location.hostname + "/" + $button.attr("href");
                window.history.pushState("", null, link);
            }
        }, "json");
    },
    sendCallback: function ($form) {
        ms.loaderShow();
        $form.find(".has-error").removeClass("has-error");
        $.post(ms.url.api + ms.url.sendCallback, $form.find(":input"), function (response) {
            if (response.result == "success") {
                ms.loaderHide();
                $("#callback-modal").modal("hide");
                $("#thx-callback").modal("show");
            }
            if (response.result == "error" && response.errors) {
                ms.loaderHide();
                if (typeof response.errors === "string") {
                    ms.showErrorModal(response.errors);
                } else {
                    $.each(response.errors, function (key, value) {
                        $("#" + value).parents(".form-group").addClass("has-error");
                    });
                }
            }
            var $button = $form.find("button");
            $button.removeAttr("disabled");
        }, "json");
    },
    sendFAQ: function ($form) {
        $.post(ms.url.api + ms.url.sendFAQ, $form.find(":input"), function (response) {
            if (response.result == "success") {
                $("#help-modal").modal("hide");
                $("#thx-callback").modal("show");
            }
            var $button = $form.find("button");
            $button.removeAttr("disabled");
        }, "json");
    },
    getSurprise: function ($form) {
        $.get(ms.url.api + ms.url.getSurprise, $form.find(":input"), function (response) {
            if (response.result == "success") {
                ms.modals.$randomModal.find(".modal-content").html(response.html);
                ms.modals.$randomModal.modal("show");
                textCrop();
            }
            if (response.result == "error") {
                if (response.errors) {
                    $.each(response.errors, function (key, value) {
                        $("#" + value).parents(".form-group").addClass("has-error");
                    });
                }
            }
        }, "json");
    },
    addToCart: function ($button) {
        var requestData = {
            item_id: $button.data("item-id"),
            action_id: $button.data("action-id") || "",
            action_type: $button.data("action-type") || ""
        };
        var windowWidth = parseInt($(window).width(), 10);
        var windowHeight = parseInt($(window).height(), 10);
        var mobile = ($(".mm-mobile-open").css("display") == "block");
        var cart = $(".icon-basket");
        // кнопка или в сетке или в карточке товара
        var imgtodrag = ($button.closest(".cat-item").find(".cat-item-img").length > 0) ? $button.closest(".cat-item").find(".cat-item-img") : $button.closest(".cart-item-modal").find(".cart-item-modal-img");
        if (imgtodrag.length == 0 && $button.closest(".mob-cat-item").find(".mob-cat-item-img").length > 0) imgtodrag = $button.closest(".mob-cat-item").find(".mob-cat-item-img");
        if (imgtodrag.length > 0) {
            var imgclone = imgtodrag.clone().offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            }).css({
                opacity: "0.5",
                position: "absolute",
                height: imgtodrag.height(),
                width: imgtodrag.width(),
                "z-index": "10002"
            }).appendTo($body).animate({
                top: (!mobile) ? (cart.offset().top + windowHeight/2 - $('.side-nav').height()/4-10) : cart.offset().top,
                left: (!mobile) ? (windowWidth - 30) : windowWidth - 30,
                width: 0,
                height: 0
            }, 700);
            imgclone.animate({
                width: 0,
                height: 0
            }, function () {
                $(this).detach();
            });
        }
        $.post(ms.url.api + ms.url.addToCart, requestData, function (response) {
            $(".side-nav").find(".basket-count").text(response.cart_total);
            $(".cart").find(".basket-count").text(response.cart_total);
            if ($(".js-cart-step-one").length > 0) {
                ms.cartStepOne(true);
            }
            if ($button.parents('#action-product-modal').size()) {
                window.location.replace("cart/");
                ms.loaderShow();
            }
        }, "json");
    },
    addGiftToCart: function ($button) {
        var requestData = {
            item_id: $button.data("item-id"),
            action_id: $button.data("action-id") || "",
            action_type: $button.data("action-type") || "",
            quantity_max: $button.data("quantity-max") || 1
        };
        var windowWidth = parseInt($(window).width(), 10);
        var windowHeight = parseInt($(window).height(), 10);
        var mobile = ($(".mm-mobile-open").css("display") == "block");
        var cart = $(".icon-basket");
        var imgtodrag = ($button.closest(".cat-item").find(".cat-item-img").length > 0)
            ? $button.closest(".cat-item").find(".cat-item-img")
            : $button.closest(".cart-item-modal").find(".cart-item-modal-img");
        if (imgtodrag.length > 0) {
            var imgclone = imgtodrag.clone().offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            }).css({
                opacity: "0.5",
                position: "absolute",
                height: imgtodrag.height(),
                width: imgtodrag.width(),
                "z-index": "10002"
            }).appendTo($body).animate({
                top: (!mobile) ? (cart.offset().top + windowHeight/2 - $('.side-nav').height()/4-10) : cart.offset().top,
                left: (!mobile) ? (windowWidth - 30) : windowWidth - 30,
                width: 0,
                height: 0
            }, 700);
            imgclone.animate({
                width: 0,
                height: 0
            }, function () {
                $(this).detach();
            });
        }
        $.post(ms.url.api + ms.url.addGiftToCart, requestData, function (response) {
            if (response.gift) {
                $(".cart-product-item-gift").remove();
                $(".cart-product-item:last").after(response.gift);
            }
            $(".side-nav").find(".basket-count").text(response.cart_total);
            $(".cart").find(".basket-count").text(response.cart_total);
            ms.modals.$giftsModal.modal("hide");
            ms.modals.$cartItemModal.modal("hide");
        }, "json");
    },
    addGiftToCartRandom: function () {
        var $button, buttons = [];
        $.each(ms.modals.$giftsModal.find(".js-add-gift-to-cart"), function () {
            $button = $(this);
            buttons.push($button);
        });
        var index = Math.floor(Math.random() * buttons.length);
        ms.addGiftToCart(buttons[index]);
    },
    // из Индивидуальных предложений кидаем в корзину товар
    addToCartOffer: function($button) {
        var requestData = {
            item_id: $button.data("item-id")
        };
        $.post(ms.url.api + ms.url.addToCart, requestData, function (response) {
            $(".side-nav").find(".basket-count").text(response.cart_total);
            $(".cart").find(".basket-count").text(response.cart_total);
                window.location.replace("cart/");
                ms.loaderShow();
        }, "json");
    },
    increaseCartItem: function ($button) {
        $button.attr("disabled", "disabled");
        $.post(ms.url.api + ms.url.increaseCartItem, {
            item_id: $button.data("item-id")
        }, function (response) {
            if (response.result == "success") {
                $(".side-nav").find(".basket-count").text(response.cart_total);
                var $quantity = $button.prev();
                var quantity = parseInt($quantity.text(), 10);
                quantity++;
                $quantity.text(quantity);
                ms.recalcCart();
                ms.cartStepOne(true);
            }
        }, "json");
    },
    decreaseCartItem: function ($button) {
        $button.attr("disabled", "disabled");
        $.post(ms.url.api + ms.url.decreaseCartItem, {
            item_id: $button.data("item-id")
        }, function (response) {
            if (response.result == "success") {
                $(".side-nav").find(".basket-count").text(response.cart_total);
                $(".cart").find(".basket-count").text(response.cart_total);
                var $quantity = $button.next();
                var quantity = parseInt($quantity.text(), 10);
                quantity--;
                if (quantity == 0) {
                    var $removeButton = $button.parents(".cart-product-item").find(".js-cart-product-remove");
                    ms.removeCartItem($removeButton);
                } else {
                    $quantity.text(quantity);
                    ms.recalcCart();
                    ms.cartStepOne(true);
                }
            }
        }, "json");
    },
    removeCartItem: function ($button) {
        $button.attr("disabled", "disabled");
        $.post(ms.url.api + ms.url.removeCartItem, {
            item_id: $button.data("item-id")
        }, function (response) {
            if (response.result == "success") {
                $(".side-nav").find(".basket-count").text(response.cart_total);
                $(".cart").find(".basket-count").text(response.cart_total);
                if (!response.empty) {
                    $button.parents(".cart-product-item").remove();
                    $button.parents(".cart-product-item-gift").remove();
                }
                ms.cartStepOne(true);
            }
        }, "json");
    },
    setCartItem: function ($span, value) {
        $.post(ms.url.api + ms.url.setCartItem, {
            item_id : $span.data("item-id"),
            value   : value
        }, function (response) {
            if (response.result == "success") {
                $(".side-nav").find(".basket-count").text(response.cart_total);
                ms.recalcCart();
                ms.cartStepOne(true);
            }
        }, "json");
    },
    increaseCartTopingItem: function ($button) {
        $button.attr("disabled", "disabled");
        $.post(ms.url.api + ms.url.increaseCartToppingItem, {
            item_id: $button.data("item-id")
        }, function (response) {
            if (response.result == "success") {
                $(".side-nav").find(".basket-count").text(response.cart_total);
                $(".cart-content-item.souces").find(".cart-content-item-cost-sum").find("span").text(response.addition_total);
                var $quantity = $button.prev();
                var quantity = parseInt($quantity.text(), 10);
                quantity++;
                $quantity.text(quantity);
                ms.recalcCart();
                ms.cartStepOne(true);
            }
        }, "json");
    },
    decreaseCartTopingItem: function ($button) {
        $button.attr("disabled", "disabled");
        var $quantity = $button.next();
        var quantity = parseInt($quantity.text(), 10);
        var quantityDefault = $button.data("quantity-default");
        if (quantity > quantityDefault) {
            $.post(ms.url.api + ms.url.decreaseCartToppingItem, {
                item_id: $button.data("item-id")
            }, function (response) {
                if (response.result == "success") {
                    $(".side-nav").find(".basket-count").text(response.cart_total);
                    $(".cart-content-item.souces").find(".cart-content-item-cost-sum").find("span").text(response.addition_total);
                    quantityDefault = parseInt(quantityDefault, 10);
                    quantity--;
                    $quantity.text(quantity);
                    ms.recalcCart();
                    ms.cartStepOne(true);
                }
            }, "json");
        }
    },
    setCartTopingItem: function ($span, value) {
        $.post(ms.url.api + ms.url.setCartTopingItem, {
            item_id : $span.data("item-id"),
            value   : value
        }, function (response) {
            if (response.result == "success") {
                $(".side-nav").find(".basket-count").text(response.cart_total);
                ms.recalcCart();
                ms.cartStepOne(true);
            }
        }, "json");
    },
    increaseCartFlatwareItem: function ($button) {
        $button.attr("disabled", "disabled");
        $.post(ms.url.api + ms.url.increaseCartFlatwareItem, {
            item_id: $button.data("item-id")
        }, function (response) {
            if (response.result == "success") {
                $(".side-nav").find(".basket-count").text(response.cart_total);
                var $quantity = $button.prev();
                var quantity = parseInt($quantity.text(), 10);
                quantity++;
                $quantity.text(quantity);
                ms.recalcCart();
                ms.cartStepOne(true);
            }
        }, "json");
    },
    decreaseCartFlatwareItem: function ($button) {
        $button.attr("disabled", "disabled");
        var $quantity = $button.next();
        var quantity = parseInt($quantity.text(), 10);
        var quantityDefault = $button.data("quantity-default");
        if (quantity > quantityDefault) {
            $.post(ms.url.api + ms.url.decreaseCartFlatwareItem, {
                item_id: $button.data("item-id")
            }, function (response) {
                if (response.result == "success") {
                    $(".side-nav").find(".basket-count").text(response.cart_total);
                    quantityDefault = parseInt(quantityDefault, 10);
                    quantity--;
                    $quantity.text(quantity);
                    ms.recalcCart();
                    ms.cartStepOne(true);
                }
            }, "json");
        }
    },
    setCartFlatwareItem: function ($span, value) {
        $.post(ms.url.api + ms.url.setCartFlatwareItem, {
            item_id : $span.data("item-id"),
            value   : value
        }, function (response) {
            if (response.result == "success") {
                $(".side-nav").find(".basket-count").text(response.cart_total);
                ms.recalcCart();
                ms.cartStepOne(true);
            }
        }, "json");
    },
    startConfirmTimer: function ($confirmModal) {
        var timer = CONFIRM_TIMER;
        var $confirmTimerAgain = $confirmModal.find(".resend-confirm-code").find("a");
        var $confirmTimer = $confirmModal.find(".confirm-timer");
        $confirmTimerAgain.addClass("disabled");
        var interval = setInterval(function () {
            if (timer == 0) {
                $confirmTimerAgain.removeClass("disabled");
                $confirmTimer.parent().hide();
                clearInterval(interval);
            } else {
                timer--;
                $confirmTimer.text(timer);
            }
        }, 1000);
        $confirmTimer.text(timer);
        $confirmTimer.parent().show();
    },
    getRegistrationConfirmCode: function ($form) {
        var $loader = $form.parents(".modal-body").find(".loader-box");
        $loader.show();
        $form.find("button").attr("disabled", "disabled");
        $form.find(".has-error").removeClass("has-error");
        $.post(ms.url.api + ms.url.getRegistrationConfirmCode, $form.find(":input"), function (response) {
            $loader.hide();
            if (response.result == "success") {
                ms.modals.$loginModal.modal("hide");
                ms.modals.$registerConfirmModal.find(".modal-body-header-text").find("span").text(response.phone);
                ms.modals.$registerConfirmModal.modal("show");
                ms.modals.$registerConfirmModal.find("input").focus();
                ms.startConfirmTimer(ms.modals.$registerConfirmModal);
            }
            if (response.result == "error") {
                if (response.error) {
                    if (response.error == "user-exists") {
                        ms.modals.$loginModal.modal("hide");
                        var $modalText = ms.modals.$errorModal.find(".thx-modal-text");
                        $modalText.text("Вы уже зарегистрированы на нашем сайте и можете авторизоваться через вкладку «Войти»");
                        $modalText.next().attr("data-toggle", "modal");
                        $modalText.next().attr("data-target", "#login");
                        $modalText.next().attr("data-tab", "#login-tab");
                        ms.modals.$errorModal.modal("show");
                    } else {
                        ms.showErrorModal(response.error);
                    }
                }
                if (response.errors) {
                    $.each(response.errors, function (key, value) {
                        $("#" + value).parents(".form-group").addClass("has-error");
                    });
                }
            }
        }, "json");
    },
    confirmRegistration: function ($form) {
        var $loader = $form.parents(".modal-body").find(".loader-box");
        var $button = $form.find("button");
        $button.attr("disabled", "disabled");
        $loader.show();
        $.post(ms.url.api + ms.url.confirmRegistration, $form.find(":input"), function (response) {
            $loader.hide();
            if (response.result == "success") {
                ms.modals.$registerModal.find("input").val("");
                ms.modals.$registerModal.find("button").removeAttr("disabled");
                ms.modals.$registerConfirmModal.modal("hide");
                ms.modals.$registerThanksmModal.find("button").attr("onclick", 'location.replace("' + response.redirect + '")');
                ms.modals.$registerThanksmModal.modal("show");
            }
            if (response.result == "error") {
                ms.modals.$registerConfirmModal.modal("hide");
                var $modalText = ms.modals.$errorModal.find(".thx-modal-text");
                $modalText.text("Вы указали неверный проверочный код");
                $modalText.next().attr("data-toggle", "modal");
                $modalText.next().attr("data-target", "#register-confirm");
                ms.modals.$errorModal.modal("show");
                $button.removeAttr("disabled");
            }
        }, "json");
    },
    getLoginConfirmCode: function ($form) {
        var $loader = $form.parents(".modal-body").find(".loader-box");
        $loader.show();
        $form.find("button").attr("disabled", "disabled");
        $form.find(".has-error").removeClass("has-error");
        $.post(ms.url.api + ms.url.getLoginConfirmCode, $form.find(":input"), function (response) {
            $loader.hide();
            if (response.result == "success") {
                ms.modals.$loginModal.modal("hide");
                ms.modals.$loginConfirmModal.find(".modal-body-header-text").find("span").text(response.phone);
                ms.modals.$loginConfirmModal.modal("show");
                ms.startConfirmTimer(ms.modals.$loginConfirmModal);
            }
            if (response.result == "error") {
                if (response.error) {
                    switch (response.error) {
                        case "not-registered":
                            var $regTab = ms.modals.$loginModal.find('a[href="#register-tab"]');
                            $("#register_phone").val($("#login_phone").val());
                            $regTab.click();
                            break;
                        default:
                            ms.showErrorModal(response.error);
                    }
                }
                if (response.errors) {
                    $.each(response.errors, function (key, value) {
                        $("#" + value).parents(".form-group").addClass("has-error");
                    });
                }
            }
            $form.find("button").removeAttr("disabled");
        }, "json");
    },
    confirmLogin: function ($form) {
        var $loader = $form.parents(".modal-body").find(".loader-box");
        var $button = $form.find("button");
        $button.attr("disabled", "disabled");
        $loader.show();
        $.post(ms.url.api + ms.url.confirmLogin, $form.find(":input"), function (response) {
            $loader.hide();
            if (response.result == "success" && response.redirect) {
                ms.modals.$loginModal.find("input").val("");
                ms.modals.$loginModal.find("button").removeAttr("disabled");
                window.location.reload();
            }
            if (response.result == "error") {
                ms.modals.$loginConfirmModal.modal("hide");
                var $modalText = ms.modals.$errorModal.find(".thx-modal-text");
                $modalText.text("Вы указали неверный проверочный код");
                $modalText.next().attr("data-toggle", "modal");
                $modalText.next().attr("data-target", "#login-confirm");
                ms.modals.$errorModal.modal("show");
                $button.removeAttr("disabled");
            }
        }, "json");
    },

    // обновление статуса текущего заказа
    getCurrentOrderStatusTimer: function () {
        $.post(ms.url.api + ms.url.getCurrentOrderStatusTimer, {}, function (response) {
            if (response.result == "success") {
                if (!($("#current_mark").size())) {
                    $(".cabinet-nav>ul").prepend('<li id="current_mark"><a href="#current" data-toggle="tab"><i class="icon-current_order"></i> Текущий заказ</a></li>');
                }
                $(".tab-content.cabinet-page #current").remove();
                $(".tab-content.cabinet-page").append(response.html);
                if ($("#order_delivered").hasClass("active")) {
                    clearInterval(currentOrderStatusTimeInterval);
                }
            }
            if (response.result == "error") {
                if (response.message == 'order_done') {
//                    до этой ветки не дойдет, т.к. таймер остановится раньше, когда заказ доставлен!
                }
                if (response.message == 'no_user') {
                    clearInterval(currentOrderStatusTimeInterval);
                    window.location.replace(response.redirect);
                }
            }
        });
    },

    // получение таймера Гарантированной доставки
    getOrderTimer: function () {
        var timer = $(".side-nav .timer");
        var timer_message = $(".side-nav #timer-message");
        var timer_num = $(".side-nav .timer-num");
        var timer_img = $(".side-nav .timer-img");
        var timer_gift = $(".side-nav #timer-gift");
        var timer_heart = $(".side-nav #timer-heart");
        $.post(ms.url.api + ms.url.getOrderTimer, {order_id: timer.data('order')}, function (response) {
            if (response.result == "success") {
//                    alert ("Получили! code=" + response.code + ", message=" + response.message);
                if (response.code != 'Complete'){
                    timer.removeClass("hidden").data('order', response.order['id']);
                    timer_message.text(response.message);
                    switch (response.code) {
                        case 'Processing':
                            timer_img.addClass("hidden");
                            timer_num.removeClass("hidden");
                            remainTime = response.order['remainTime'];
                            updateClock(); // запустим таймер первый раз, чтобы избежать задержки
                            timeinterval = setInterval(updateClock,1000);
                            break;
                        case 'Late':
                            timer_num.addClass("hidden");
                            timer_heart.addClass("hidden");
                            timer_gift.removeClass("hidden");
                            // обновляем данные из 1С каждые 1 минут
                            setTimeout('clearInterval(timeinterval);ms.getOrderTimer()', 1*60*1000);
                            break;
                        default:
                            timer_num.addClass("hidden");
                            timer_gift.addClass("hidden");
                            timer_heart.removeClass("hidden");
                            // обновляем данные из 1С каждые 1 минут
                            setTimeout('clearInterval(timeinterval);ms.getOrderTimer()', 1*60*1000);
                    }
                } else {
                    timer.addClass("hidden").data('order', '');
                }
            }
            if (response.result == "error") {
                timer.addClass("hidden").data('order', '');
//                    alert ("Нет клиента или нет срочного заказа!");
            }
        });
    },

    // получение цены доставки и возможности Гарантированной доставки (после ввода улицы и дома)
    getDeliveryCost: function (street, house) {
        if (street.length > 0 && house.length > 0) {
            var $tab = $(".tab-pane.active").attr("id");
            var requestData = ms.getStepTwoFormData($tab);
            var $productsTotal = $("#invoice-cart-total");
            var $shippingTotal = $("#invoice-shipping-total");
            var deliveryDate = $(".tab-pane.active").find('#checkout_delivery_date-styler .jq-selectbox__select-text').text().toString();
            $.post(ms.url.api + ms.url.getDeliveryCost, requestData, function (response) {
                if (response.result == "success") {
                    if ($shippingTotal.length == 0) {
                        $productsTotal.after(response.html);
                    } else {
                        $shippingTotal.replaceWith(response.html);
                    }
                    ms.recalcInvoice();
                    if (response.bonus > 0) {
                        $(".cart-content-balls-T").find("span").text(response.bonus);
                    }
                    if (response.response['response']['isGuaranteeDelivery']) {
                        $("#guarantee_delivery_box").addClass('in');
                        if (deliveryDate.indexOf("Сегодня")>-1) {
                            $("#guarantee_delivery_box").show(400).find("#guarantee_delivery_accept").attr("data-time", response.response['response']['guaranteeTime']);
                        }
                        $("#guarantee-delivery-modal").find("#guarantee_descr").text(response.response['response']['guaranteeDescription']);
                    } else $("#guarantee_delivery_box").hide(400).removeClass('in').find("#guarantee_delivery_accept").removeAttr("checked");
                }
                if (response.result == "error") {
                    $("#guarantee_delivery_box").hide(400).removeClass('in').find("#guarantee_delivery_accept").removeAttr("checked");
                }
            });
        }
    },

    getStreets: function (term, $target) {
        var list = "";
        $.get(ms.url.api + ms.url.getStreets, {
            term: term
        }, function (response) {
            if (response.streets.length > 0) {
                $.each(response.streets, function () {
                    list += '<li data-code="' + this.code + '">' + this.name + " (" + this.locality + ")</li>";
                });
                $(".tab-pane.active .streets-list").remove();
                $target.after('<div id="streets-list" class="streets-list"><ul>' + list + "</ul></div>");
            }
        }, "json");
    },
    setStreet: function ($item) {
        var $streetInput = $item.parents(".form-group").find(".js-street-autocomplete");
        var $streets = $(".streets-list");
        $streetInput.attr("data-street-code", $item.data("code"));
        $streetInput.val($item.text());
        $streets.remove();
        if ($("#account-profile-form").length > 0) {
            $streetInput.next().val($item.data("code"));
        }
    },
    setAddress: function ($item) {
        var street_code = (!!$item.data("street-code")) ? $item.data("street-code") : $item.data("streetcode");
        $("#checkout_street").val($item.data("street")).attr("data-street-code", street_code);
        $("#checkout_house_number").val($item.data("house"));
        $("#checkout_porch").val($item.data("porch"));
        $("#checkout_floor").val($item.data("floor"));
        $("#checkout_flat").val($item.data("flat"));
        $("#addresses-list").addClass("hidden");
        $(".js-street-autocomplete").addClass("from-favorite-address");
        ms.getDeliveryCost(street_code.toString(), $item.data("house").toString());
    },
    removeAccountAddress: function ($button) {
        $button.parents(".cabinet-data-form-ajax-item").parent().remove();
    },
    addAccountAddress: function ($button) {
        $.get(ms.url.api + ms.url.newAddress, {}, function (response) {
            if (response.html) {
                $(".addresses-list").append(response.html);
                stylerInit();
            }
        }, "json");
    },
    updateAccountProfile: function ($form) {
        $form.find(".has-error").removeClass("has-error");
        var validate = true;
        var $required = $form.find('input[data-required="true"]');
        $required.each(function($item) {
            var $this = $(this);
            if ($this.val() === "") {
                $this.parents(".form-group").addClass("has-error");
                ms.scrollToError();
                ms.modals.$errorModal.find(".thx-modal-text").text("Пожалуйста, заполните все поля, отмеченные *");
                ms.modals.$errorModal.modal("show");
                return (validate = false);
            }
        });
        if (validate) {
            ms.loaderShow();
            var requestData = $form.find('input[type="text"], input[type="email"], input[type="hidden"], input[type="checkbox"]:checked, input[type="radio"]:checked');
            $.post(ms.url.api + ms.url.updateAccountProfile, requestData, function (response) {
                if (response.result == "success") {
                    $(".login.inside.toolbar").find(".user-name").text(response.name);
                    $(".cabinet-header-text").find("span").text(response.name);
                }
                if (response.result == "error") {
                    ms.showErrorModal(response.errors);
                }
                ms.loaderHide();
            }, "json");
        }
    },
    recalcCart: function () {
        var cartTotal = 0;
        $.each($(".cart-product-item"), function () {
            var $row = $(this);
            var price = $row.find(".cart-content-item-cost").find("span").text();
            price = parseFloat(price);
            var quantity = $row.find(".cart-content-item-count-box").find("span").text();
            quantity = parseInt(quantity, 10);
            var total = price * quantity;
            $row.find(".cart-content-item-cost-sum").find("span").text(total);
            cartTotal += total;
        });
        $.each($(".cart-product-item-topping"), function () {
            var $row = $(this);
            var price = $row.find(".js-cart-add-product-dec").data("price");
            price = parseFloat(price);
            var quantity = $row.find(".cart-content-item-count-box").find("span").text();
            quantity = parseInt(quantity, 10);
            var freeQuantity = $row.find(".js-cart-add-product-dec").data("quantity-default");
            var total = price * (quantity - freeQuantity);
            $row.find(".cart-content-item-cost-sum").find("span").text(total);
            cartTotal += total;
        });
        $.each($(".cart-product-item-flatware"), function () {
            var $row = $(this);
            var price = $row.find(".js-cart-add-flatware-dec").data("price");
            price = parseFloat(price);
            var quantity = $row.find(".cart-content-item-count-box").find("span").text();
            quantity = parseInt(quantity, 10);
            var freeQuantity = $row.find(".js-cart-add-flatware-dec").data("quantity-default");
            var total = price * (quantity - freeQuantity);
            $row.find(".cart-content-item-cost-sum").find("span").text(total);
            cartTotal += total;
        });
        $(".cart-total-amount").find("li").html(cartTotal + ' <i class="icon-rubl_bold"></i>');
    },
    recalcInvoice: function () {
        var total;
        var products = parseFloat($("#invoice-cart-total").find(".icon-rubl_regular").parent().text());
        var shipping = parseFloat($("#invoice-shipping-total").find(".icon-rubl_regular").parent().text()) || 0;
        var discount = parseFloat($("#invoice-discount-total").find(".icon-rubl_regular").parent().text()) || 0;
        var bonus = parseFloat($("#invoice-bonus-total").find("input").val()) || 0;
        total = products + shipping - discount - bonus;
        $("#invoice-total").find("li").html(total.toFixed(2) + ' <i class="icon-rubl_regular"></i>');
    },
    cartStepOne: function (update) {
        update = update || false;
//        if (!update) {
            ms.loaderShow();
//        }
        var birthday = $("#cart_step_one_birthday").val();
        var phone = $("#cart_step_one_phone").val();
        var $productsBeacon = $("#cart-products-list-beacon");
        var $toppingsBeacon = $("#cart-toppings-list-beacon");
        var $flatwareBeacon = $("#cart-flatware-list-beacon");
        var $actionsBeacon = $("#cart-actions-block-beacon");
        var $formBeacon = $("#cart-step-one-form-beacon");
        var $toppingsContainer = $("#souses-modal").find(".modal-body").find(".row:first");
        var $giftsContainer = $("#gift-modal").find(".modal-body").find(".row:first");
        var $buttonPlus = $(".icon-plus").parent();
        var $buttonMinus = $(".icon-minus").parent();
        var $buttonRemove = $(".js-cart-product-remove");
        $buttonPlus.attr("disabled", "disabled");
        $buttonMinus.attr("disabled", "disabled");
        $buttonRemove.attr("disabled", "disabled");
        $.post(ms.url.api + ms.url.getCartStepOne, {
            birthday: birthday,
            phone: phone,
            update: update
        }, function (response) {
            ms.loaderHide();
            if (response.result == "error") {
                ms.showErrorModal(response.errors);
            } else {
                if (response.empty) {
                    $(".js-cart-step-one").parents("ul").hide();
                    var $c = $(".cart-content").find(".container");
                    var $f = $c.find(".cart-outer");
                    $f.next().remove();
                    $f.next().remove();
                    $f.next().remove();
                    $f.remove();
                    $c.find(".cart-content-footer").remove();
                    $c.find(".cart-content-more-items").remove();
                    $c.append(response.empty);
                } else {
                    var $next;
                    if (update) {
                        $(".cart-product-item").remove();
                        $(".cart-product-item-gift").remove();
                    }
                    if (response.cart.products) {
                        $productsBeacon.after(response.cart.products);
                    }
                    if (update) {
                        $next = $toppingsBeacon.next();
                        if ($next.hasClass("cart-content-item")) {
                            $next.remove();
                        }
                    }
                    if (response.cart.toppings) {
                        $toppingsBeacon.after(response.cart.toppings);
                    }
                    if (update) {
                        $(".cart-product-item-flatware").remove();
                    }
                    if (response.cart.flatware) {
                        $flatwareBeacon.after(response.cart.flatware);
                    }
                    if (response.list.toppings) {
                        $toppingsContainer.html(response.list.toppings);
                    }
                    if (update) {
                        $next = $actionsBeacon.next();
                        if ($next.hasClass("cart-content-more-items_container")) {
                            $next.remove();
                        }
                    }
                    if (response.list.actions) {
                        $actionsBeacon.after(response.list.actions).show();
                    }
                    if (response.list.gifts) {
                        $giftsContainer.html(response.list.gifts);
                    }
                    if (update) {
                        $formBeacon.next().remove();
                    }
                    if (response.form) {
                        $formBeacon.after(response.form);
                    }
                    $(".cart").find(".basket-count").text(response.totals.cart);
                    $(".cart-content-sum").find(".icon-rubl_bold").parent().html(response.totals.cart + ' <i class="icon-rubl_bold"></i>');
                    $("#cart-total-bonus").text(response.totals.bonus);
                    ms.initInputMasks();
                }
            }
            $buttonPlus.removeAttr("disabled");
            $buttonMinus.removeAttr("disabled");
            $buttonRemove.removeAttr("disabled");
            if (response.totals && response.totals.cart) {
                $(".side-nav").find(".basket-count").text(response.totals.cart);
            }
        }, "json");
    },
    checkCartStopOne: function ($form) {
        var data = $form.find("input");
        $form.find(".has-error").removeClass("has-error");
        $.post(ms.url.api + ms.url.checkCartStepOne, data, function (response) {
            if (response.result == "success") {
                window.location.replace(response.redirect);
            }
            if (response.result == "error") {
                $(".js-step-one-checkout").removeAttr("disabled");
                if (response.error == "birthday") {
                    $("#error-birthday").modal("show");
                } else {
                    if (response.error == "no-gift") {
                        $("#error-no-gift").modal("show");
                    } else {
                        ms.modals.$errorModal.find(".thx-modal-text").text("Заполните поля корректно.");
                        ms.modals.$errorModal.modal("show");
                    }
                }
                $.each(response.errors, function (key, value) {
                    $("#" + value).parents(".form-group").addClass("has-error");
                });
                ms.scrollToError();            }
        }, "json");
    },

    // Оформление заказа, шаг 2
    checkCartStepTwo: function () {
        ms.loaderShow();
        var $activeTab = $(".tab-pane.active");
        var tabId = $activeTab.attr("id");
        var formData = ms.getStepTwoFormData(tabId);
        if (formData.isGuaranteeDelivery) {
            $.post(ms.url.api + ms.url.getDeliveryTimes, formData, function (response) {
                if (response.result == "success") {
                    formData.delivery["time"]["index"] = 0;
                    formData.delivery["time"]["id"] = response.times["0"]["id"];
                    ms.goNextStepTwo(tabId, formData);
                }
                if (response.result == "error") {
                    ms.loaderHide();
                    $activeTab.find("#guarantee_delivery_box").hide().removeClass("in").find("#guarantee_delivery_accept").removeAttr('checked');
                    ms.modals.$errorModal.find(".thx-modal-text").text(response.error);
                    ms.modals.$errorModal.modal("show");
                }
            });
        } else {
            ms.goNextStepTwo(tabId, formData);
        }
    },
    goNextStepTwo: function (tabId, formData) {
        $("#" + tabId).find(".has-error").removeClass("has-error");
        $.post(ms.url.api + ms.url.checkCartStepTwo, formData, function (response) {
            if (response.result == "success") {
                if (response.redirect) {
                    window.location.replace(response.redirect);
                } else {
                    ms.loaderHide();
                    if (response.online) {
                        switch (response.online_operator) {
                            case ('yandex'):
                                $body.append(response.form);
                                 var orderTotal = $("#invoice-total").find("li").text();
                                 var $form = $body.find("#online-payment-form");
                                 if ($form.length > 0) {
                                     $form.find('input[name="sum"]').val(orderTotal);
                                     $form.submit();
                                 }
                                break;
                            case ('sber'):
                                ms.modals.$errorModal.find("button").remove();
                                ms.modals.$errorModal.find(".thx-modal-text").html(response.message).parents('.modal-body').append(response.button);
                                link =  ms.modals.$errorModal.find('.modal-body a').attr({'class':'main-btn-small', 'type':'button'}).attr('href');
                                ms.modals.$errorModal.modal("show");
                                setTimeout(function(){window.location.replace(link);}, 3000);
                                break;
                        }
                    } else {
                        ms.modals.$orderConfirmModal.find(".modal-body-header-text").find("span").text(response.phone);
                        ms.modals.$orderConfirmModal.modal("show");
                        ms.startConfirmTimer(ms.modals.$orderConfirmModal);
                    }
                }
            }
            if (response.result == "error") {
                $(".js-step-two-checkout").removeAttr("disabled");
                ms.loaderHide();
                ms.showErrorModal(response.error);
                if (response.errors) {
                    var prefix;
                    if (tabId == "tab-1") {
                        prefix = "checkout_";
                    } else {
                        prefix = "checkout_pickup_";
                    }
                    $.each(response.errors, function (key, value) {
                        $("#" + prefix + value).parents(".form-group").addClass("has-error");
                        $("#" + prefix + value + "_number").parents(".form-group").addClass("has-error");
                    });
                    ms.scrollToError();
                }
            }
        }, "json");
    },
    orderConfirm: function ($form) {
        ms.loaderShow();
        var $button = $form.find("button");
        $.post(ms.url.api + ms.url.orderConfirm, $form.find(":input"), function (response) {
            if (response.result == "success") {
                if (response.redirect) {
                    window.location.replace(response.redirect);
                } else {
                    ms.loaderHide();
                    if (response.online) {
                        switch (response.online_operator) {
                            case ('yandex'):
                                $body.append(response.form);
                                var orderTotal = $("#invoice-total").find("li").text();
                                var $form = $body.find("#online-payment-form");
                                if ($form.length > 0) {
                                    $form.find('input[name="sum"]').val(orderTotal);
                                    $form.submit();
                                }
                                break;
                            case ('sber'):
                                ms.modals.$orderConfirmModal.modal("hide");
                                ms.modals.$errorModal.find("button").remove();
                                ms.modals.$errorModal.find(".thx-modal-text").html(response.message).parents('.modal-body').append(response.button);
                                link =  ms.modals.$errorModal.find('.modal-body a').attr({'class':'main-btn-small', 'type':'button'}).attr('href');
                                ms.modals.$errorModal.modal("show");
                                setTimeout(function () {window.location.replace(link);}, 3000);
                                break;
                        }
                    }
                }
            }
            if (response.result == "error") {
                ms.loaderHide();
                ms.modals.$orderConfirmModal.modal("hide");
                (response.rbs === 1) ? ms.showErrorModal(response.error) : ms.showErrorModal(response.error, "order-confirm");
            }
            $(".js-step-two-checkout").removeAttr("disabled");
        }, "json");
    },
    getDeliveryDates: function (street, house, type) {
        var requestData = {
            street_code: street || "",
            house_number: house || ""
        };
        $.post(ms.url.api + ms.url.getDeliveryDates, requestData, function (response) {
            var i, date, list = "";
            if (response.result == "success") {
                for (i = 0; i < response.dates.length; i++) {
                    date = response.dates[i];
                    list += '<option value="' + date.date + '" data-index="' + date.index + '">' + date.name + "</option>";
                }
                $("#checkout_" + type + "_date").html(list).trigger("refresh");
                setTimeout(function () {
                    var dt = $(".js-delivery-time-refresh");
                    dt.val("");
                    dt.attr("data-code", "");
                    dt.attr("data-index", "");
                }, 100);
            }
            if (response.result == "error") {
                ms.showErrorModal(response.errors);
            }
        }, "json");
    },
    getDeliveryTimes: function ($target) {
        if ($target.hasClass("refreshing")) {
            return false;
        }
        $(".time-list").remove();
        $target.val("");
        $target.attr("data-code", "");
        $target.attr("data-index", "");
        $target.addClass("refreshing");
        var $tab = $(".tab-pane.active").attr("id");
        var requestData = ms.getStepTwoFormData($tab);
        if (requestData.street && requestData.house) {
            var $loader = $target.parents(".tab-pane").find(".loader-box");
            $loader.show();
            $.post(ms.url.api + ms.url.getDeliveryTimes, requestData, function (response) {
                if (response.result == "success") {
                    var list = "";
                    $.each(response.times, function () {
                        list += '<li data-index="' + this.index + '" data-code="' + this.id + '">' + this.name + "</li>";
                    });
                    $target.after('<div class="time-list"><ul>' + list + "</ul></div>");
                }
                if (response.result == "error") {
                    ms.modals.$errorModal.find(".thx-modal-text").text(response.error);
                    ms.modals.$errorModal.modal("show");
                }
                $target.removeClass("refreshing");
                $loader.hide();
            });
        } else {
            if (requestData.type == "courier") {
                ms.modals.$errorModal.find(".thx-modal-text").text("Для расчёта доступного времени доставки укажите адрес. Для этого выберите улицу из списка и укажите номер дома.");
                if (!requestData.street) {
                    $(".js-street-autocomplete").val("");
                }
            } else {
                ms.modals.$errorModal.find(".thx-modal-text").text("Для расчёта доступного времени доставки укажите адрес самовывоза.");
            }
            ms.modals.$errorModal.modal("show");
            $target.removeClass("refreshing");
        }
    },
    setTime: function ($item) {
        var $times = $item.parents(".time-list");
        var $timeInput = $times.prev();
        $timeInput.attr("data-code", $item.data("code"));
        $timeInput.attr("data-index", $item.data("index"));
        $timeInput.val($item.text());
        $times.remove();
    },
    getStepTwoFormData: function (tabId) {
        var formData = {},
            $deliveryTime, $deliveryDate;
        switch (tabId) {
            case "tab-1":
                var $checkoutStreet = $("#checkout_street");
                formData.name = $("#checkout_name").val();
                formData.street = $checkoutStreet.attr("data-street-code");
                formData.street_name = $checkoutStreet.val();
                formData.house = $("#checkout_house_number").val();
                formData.floor = $("#checkout_floor").val();
                formData.porch = $("#checkout_porch").val();
                formData.flat = $("#checkout_flat").val();
                $deliveryDate = $("#checkout_delivery_date");
                formData.delivery = {};
                formData.delivery["date"] = $deliveryDate.val() || $deliveryDate.find("option:first").val();
                $deliveryTime = $("#checkout_delivery_time");
                formData.delivery["time"] = {};
                formData.delivery["time"]["index"] = $deliveryTime.attr("data-index");
                formData.delivery["time"]["id"] = $deliveryTime.attr("data-code");
                formData.delivery["time"]["text"] = $deliveryTime.val();
                formData.isGuaranteeDelivery =  $("#guarantee_delivery_accept").attr("checked") ? true : false;
                formData.guaranteeTime = $("#guarantee_delivery_accept").attr("checked") ? $("#guarantee_delivery_accept").attr("data-time") : "";
                formData.comment = $("#checkout_comment").val();
                formData.type = "courier";
                formData.tvName = (ms.modals.$endOrdersModal) ? ms.modals.$endOrdersModal.data("tv") : '';
                break;
            case "tab-2":
                formData.name = $("#checkout_pickup_name").val();
                var $pickupPlace = $("#checkout_pickup_place");
                var t = $pickupPlace.val().split("::");
                formData.place = t[2];
                formData.street = t[0];
                formData.house = t[1];
                $deliveryDate = $("#checkout_pickup_date");
                formData.delivery = {};
                formData.delivery["date"] = $deliveryDate.val() || $deliveryDate.find("option:first").val();
                $deliveryTime = $("#checkout_pickup_time");
                formData.delivery["time"] = {};
                formData.delivery["time"]["id"] = $deliveryTime.attr("data-code");
                formData.delivery["time"]["index"] = $deliveryTime.attr("data-index");
                formData.delivery["time"]["text"] = $deliveryTime.val();
                formData.delivery["place"] = $pickupPlace.find(":selected").text();
                formData.comment = $("#checkout_pickup_comment").val();
                formData.type = "pickup";
                break;
        }
        formData.payment = {};
        /**
         * @var string formData.payment["type"] = ('cash' || 'card' || 'online')
         */
        formData.payment["type"] = $('input[name="checkout_payment"]:checked').val();
        /**
         * @var string formData.payment["online"] = ('yandex' || 'sber')
         */
        formData.payment["online"] = (formData.payment["type"] == 'online') ? $('input[name="checkout_online_payment"]:checked').val() : false;
        formData.payment["bonus"] = $("#invoice-bonus-total").find("input").val();
        formData.payment["total"] = $("#invoice-total").find("li").text();
        return formData;
    },
    clearCatalogFilters: function () {
        ms.forms.$catalogFilterForm.find(".radiobtn").removeAttr("checked");
        ms.forms.$catalogFilterForm.submit();
    },
    doCatalogFilter: function ($form) {
        ms.loaderShow();
        var $this, value;
        var showClearFilterButton = false;
        var labels = {
            include: [],
            exclude: []
        };
        var ingredients = {
            include: [],
            exclude: []
        };
        $.each($form.find(":input:checked"), function () {
            showClearFilterButton = true;
            $this = $(this);
            value = $this.data("value");
            if ($this.data("kind") == "label") {
                if ($this.data("type") == "include") {
                    labels.include.push(value);
                }
                if ($this.data("type") == "exclude") {
                    labels.exclude.push(value);
                }
            }
            if ($this.data("kind") == "ingredient") {
                if ($this.data("type") == "include") {
                    ingredients.include.push(value);
                }
                if ($this.data("type") == "exclude") {
                    ingredients.exclude.push(value);
                }
            }
        });
        var data = {
            category: $form.data("category"),
            li: labels.include.join(),
            le: labels.exclude.join(),
            ii: ingredients.include.join(),
            ie: ingredients.exclude.join()
        };
        $.get(ms.url.api + ms.url.getProducts, data, function (response) {
            var $resetCatalogFilter = $("#reset-catalog-filter");
            $("#products-list").html(response.html);
            if (showClearFilterButton) {
                $resetCatalogFilter.show();
            } else {
                $resetCatalogFilter.hide();
            }
            ms.loaderHide();
            ms.modals.$filterModal.modal("hide");
        }, "json");
    },
    initInputMasks: function () {
        $(".inputDateBirthMask").inputmask({
            skipInputEvent: false,
            skipKeyPressEvent: false,
            clearIncomplete: false,
            placeholder: "__.__.____",
            greedy: false,
            mask: "99.99.9999"
        });
        $(".inputPhoneMask").inputmask({
            skipInputEvent: false,
            skipKeyPressEvent: false,
            clearIncomplete: false,
            placeholder: "8 ___-___-__-__",
            greedy: false,
            mask: "8 999-999-99-99"
        });
        $(".inputCountMask").inputmask({
            skipInputEvent:false,
            skipKeyPressEvent:false,
            clearIncomplete: false,
            placeholder: "",
            greedy: false,
            mask:"99"
        });
    },
    changeCity: function (cityLink) {
        var $modal = $("#change-city");
        $modal.find("button:last").attr("data-city-link", cityLink);
        $modal.modal("show");
    },
    changeCityConfirm: function ($button) {
        var href = $button.data("city-link") || false;
        ms.clearCart(href);
    },
    clearCart: function (redirect) {
        $.post(ms.url.api + ms.url.clearCart, {}, function (response) {
            if (response.result == "success") {
                if (redirect) {
                    window.location.replace(redirect);
                }
            }
        }, "json");
    },
    changeProductGroupItem: function ($tab) {
        var itemId = $tab.data("item-id");
        var $cell = ($tab.parent().hasClass('cat-item-footer')) ? $tab.parents(".cat-item").parent().parent() : $tab.parents(".mob-cat-item").parent().parent();
        $.get(ms.url.api + ms.url.getGroupProduct, {
            item_id: itemId
        }, function (response) {
            if (response.html) {
                $cell.replaceWith(response.html);
                textCrop();
            }
        }, "json");
    },
    repeatOrder: function ($button) {
        var orderId = $button.data("order-id");
        $.post(ms.url.api + ms.url.repeatOrder, {
            order_id: orderId
        }, function (response) {
            if (response.result == "success") {
                location.replace(response.redirect);
            }
        }, "json");
    },
    checkUserBirtday: function () {
        var inputBirthday = $("#cart_step_one_birthday").val();
        var inputPhone = $("#cart_step_one_phone").val().replace(/\D/g, "");
        var reBirthday = new RegExp("[0-9]{2}.[0-9]{2}.[0-9]{4}");
        var rePhone = new RegExp("[0-9]{11}");
        var $gift = $(".cart-product-item-gift");
        if (!reBirthday.test(inputBirthday) && $gift.length) {
            $gift.find(".js-cart-product-remove").click();
        }
        if (inputBirthday.length == 0 && rePhone.test(inputPhone)) {
            ms.cartStepOne(true);
        }
        if (reBirthday.test(inputBirthday) && rePhone.test(inputPhone)) {
            ms.cartStepOne(true);
        }
    },
// проверяет # в адресной строке и если есть, то ищет этот товар по псевдониму и кликает на него, запуская модалку с карточкой товара
    checkHash: function () {
        var url = window.location.hash;
        if (url.length) {
            setTimeout(function () {
                $(document).find('[data-hash="' + url + '"]').trigger("click");
            }, 500);
        }
    },
    checkSocials: function () {
        var $socials = $(".social.toolbar");
        if ($socials.find("li").length == 0) {
            $socials.parents(".social.moved").remove();
        }
    },
    activatePromo: function ($form) {
        var $loader = $form.find(".loader-box");
        $loader.show();
        $.post(ms.url.api + ms.url.activatePromo, $form.find(":input"), function (response) {
            if (response.result == "success") {
                ms.modals.$promoModal.modal("hide");
                ms.modals.$promoModalThanks.find(".thx-modal-text").text(response.message);
                ms.modals.$promoModalThanks.modal("show");
            }
            if (response.result == "error") {
                ms.showErrorModal(response.error);
            }
            $loader.hide();
        }, "json");
    },
    getBlockingTV: function (tvName, obj) {
        $.post(ms.url.api + ms.url.getBlockingTV, {tvName : tvName}, function (response) {
            if (response.result == "success") {
                if (response.tvValue=="false") {
                    $(obj).val("");
                    $(".time-list").remove();
                    $("#guarantee_delivery_box").hide(400).removeClass('in').find("#guarantee_delivery_accept").removeAttr("checked");
                    ms.modals.$endOrdersModal.modal("show");
                    ms.modals.$errorModal.modal("hide");
                } else {
                    if (obj) ms.getDeliveryTimes($(obj));
                }
            }
            if (response.result == "error") {
            }
        }, "json");
    },
    commentsShowElse: function ($button) {
        $.post(ms.url.api + ms.url.commentsShowElse, {shown : $button.data("shown")}, function (response) {
            if (response.result == "success") {
                $(".testimonials-beacon").append(response.html);
                $button.data("shown", response.shown).attr("data-shown", response.shown);
                if (response.stop) $button.remove();
            }
            if (response.result == "error") {
                $button.remove();
            }
        }, "json");
    },
    sendFriendPhone: function ($form) {
        var ajax = true;
        $form.find(":input").each(function () {
            var tel = $(this).val().replace(/\D/g, '');
            if ((tel.length < 11) && (tel.length > 0)) {
                ajax = false;
                ms.showErrorModal("В номере: " + $(this).val() + "менее 11 цифр !", "your-code-modal");
            }
        });
        if (ajax) {
            ms.loaderShow();
            $.post(ms.url.api + ms.url.sendFriendPhone, $form.find(":input"), function (response) {
                if (response.result == "success") {
                    ms.loaderHide();
                    $form.find("input").val("");
                    ms.modals.$yourCode.modal("hide");
                    (response.html1) ? $("#thx-friend").find("#friends-text1").removeClass('hidden').find("#phones1").html(response.html1) : $("#thx-friend").find("#friends-text1").addClass('hidden');
                    (response.html2) ? $("#thx-friend").find("#friends-text2").removeClass('hidden').find("#phones2").html(response.html2) : $("#thx-friend").find("#friends-text2").addClass('hidden');
                    if ((response.html1) || (response.html2)) $("#thx-friend").modal("show");
                }
                if (response.result == "error" && response.errors) {
                    ms.loaderHide();
                    if (typeof response.errors === "string") {
                        ms.showErrorModal(response.errors);
                    } else {
                        $.each(response.errors, function (key, value) {
                            $("#" + value).addClass("has-error");
                        });
                    }
                }
            }, "json");
        }
    },
    sendInterview: function($form) {
        var data = {
            radio : [],
            time : []
        };
        var radio = $form.find(":input[id^='radio']:checked");
        var time = $form.find(":input[id^='time']:checked");
        radio.each(function() {
            data.radio.push({
                "radio_id": $(this).attr('id').slice(-1),
                "radio_name": $(this).next($("label[for=" + $(this).attr('id') + "]")).html()
            });
        });
        time.each(function() {
            data.time.push({
                "time_id": $(this).attr('id').slice(-1),
                "time_interval": $(this).next($("label[for=" + $(this).attr('id') + "]")).html()
            });
        });
        $.post(ms.url.api + "/send-interview.json", data, function (response) {
            // receive nothing!!!
        }, "json");

        $form.parents().find("#interview").modal('hide');
        $form.find(":input:checked").removeAttr("checked");
    },
    scrollToError: function () {
        destination = $(".has-error").offset().top - $('#mm-nav').height();
        window.scrollTo(0, destination);
    }
};
$(document).ready(function () {
    ms.init();
    $("#cart-item-modal").on("show.bs.modal", function (e) {
        var $button = $(e.relatedTarget);
        $(this).find(".modal-content").html("");
        ms.getProduct($button);
    });
// кидаем ссылку на модалку в адресную строку
    $body.on("click", "#btn-your-code", function (e) {
        var link = location.toString() + "#" + ms.modals.$yourCodeAlias;
        window.history.pushState("", null, link);
    });
// парсим адресную строку, если она с псевдонимом модалки - открываем модалку Личный код
// а если нет - то пишем  псевдоним модалки и открываем ее, если клиент не запретил
    if ($("#btn-your-code").size()){
        var link =location.toString();
        var result = link.slice(link.search(/#/)+1);
        var ban = localStorage["ms.modalYourCode.ban"];
        switch (result){
            case (ms.modals.$yourCodeAlias):
                ms.modals.$yourCode.modal("show");
                break;
            default:
                if (!ban) {
                    var link = location.toString() + "#" + ms.modals.$yourCodeAlias;
                    window.history.pushState("", null, link);
                    ms.modals.$yourCode.modal("show");
                }
                break;
        }
    }
// активность/неактивность "Больше не показывать" в модалке "Ваш личный код"
    if (ms.modals.$yourCode.size()) {
        var $checkBox = $('#account_profile_modal_action_show');
        var ban = localStorage["ms.modalYourCode.ban"];
        (ban) ? $checkBox.attr('checked','checked').prop('checked','checked') : $checkBox.removeAttr('checked');
    }
// нажатие/отжатие "Больше не показывать" в модалке "Ваш личный код"
    $('#account_profile_modal_action_show').on ("click", function(){
        if ($(this).attr("checked")){
            $(this).removeAttr('checked');
            localStorage.removeItem("ms.modalYourCode.ban");
        } else {
            $(this).attr('checked','checked').prop('checked','checked');
            localStorage["ms.modalYourCode.ban"] = true;
        }
    });
// реакция на загрузку главной страницы сайта
    if ($("#header-slider").size()) {
        var link =location.toString();
        var result = link.slice(link.search(/#/)+1);
        switch (result){
            case (ms.modals.$yourCodeAlias):
                ms.modals.$loginModal.modal("show");
                result = link.slice(0, link.search(/#/) - 1);
                window.history.pushState("", null, result);
                break;
            default:
                break;
        }
        // проверяем блокировку заказов на текущую дату
        var tv = (ms.modals.$endOrdersModal) ? ms.modals.$endOrdersModal.data("tv") : '';
        ms.getBlockingTV(tv, null);

        // опрос клиентов "Какое радио слушаете?"
        // включить опрос
        //        localStorage.removeItem("ms.modalInterview.ban");
        var ban = localStorage["ms.modalInterview.ban"];
        if(!ban && $("#interview").size()) $("#interview").modal("show");
    }

    $body.on("click", ".js-get-prev-product, .js-get-next-product", function (e) {
        e.preventDefault();
        var $button = $(this);
        ms.getProduct($button);
    });
    $("#news-modal").on("show.bs.modal", function (e) {
        var $button = $(e.relatedTarget);
        ms.getNews($button);
    });
    $body.on("click", ".js-get-prev-news, .js-get-next-news", function (e) {
        e.preventDefault();
        var $button = $(this);
        ms.getNews($button);
    });
    $body.on("submit", "#comment-form", function (e) {
        e.preventDefault();
        if ($("#testimonial_text").val()===""){
            ms.showErrorModal("Пожалуйста, заполните текст отзыва!", "comment");
        } else {
            var $form = $(this);
            var $button = $form.find("button");
            $button.attr("disabled", "disabled");
            ms.sendTestimonial($form);
        }
    });
// отправка телефонов друзей по акции из ЛК
    $body.on("submit", "#send-phones-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.sendFriendPhone($form);
    });
    $body.on("keypress", ".friend_phone", function (e) {
        if(e.which == 13){
            e.preventDefault();
            var num = $(this).attr('id');
            num = ++num[num.length-1];
            ($("#friend_phone_" + num).size()) ? $("#friend_phone_" + num).focus() : $(this).parents("form").submit();
        }
    });
// Заказать звонок
    $body.on("submit", "#callback-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        var $button = $form.find("button");
        $button.attr("disabled", "disabled");
        ms.sendCallback($form);
    });
    $body.on("submit", "#help-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        var $button = $form.find("button");
        $button.attr("disabled", "disabled");
        ms.sendFAQ($form);
    });
    $body.on("submit", "#surprise-me-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.getSurprise($form);
    });
    $body.on("click", ".js-surprise-me-renew", function (e) {
        e.preventDefault();
        setTimeout(function () {
            $("#surprise-me-form").submit();
        }, 1000);
    });
    $body.on("click", ".js-surprise-me-to-cart", function () {
        var $button = $(this);
        $button.attr("disabled", "disabled");
        $button.parents(".modal-footer").find(".loader-box").show();
        setTimeout(function () {
            $.each(ms.modals.$randomModal.find(".js-add-to-cart"), function () {
                $(this).click();
                sleep(500);
            });
            $("#surprise-me-form").find(":input").val("");
            ms.modals.$randomModal.modal("hide");
        }, 1000);
    });
    $body.on("click", ".js-add-to-cart", function (e) {
        e.preventDefault();
        var $button = $(this);
        ms.addToCart($button);
    });
    $body.on("submit", "#login-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.getLoginConfirmCode($form);
    });
    $body.on("submit", "#login-confirm-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.confirmLogin($form);
    });
    $body.on("submit", "#register-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.getRegistrationConfirmCode($form);
    });
    $body.on("submit", "#register-confirm-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.confirmRegistration($form);
    });
    $body.on("click", ".js-resend-code-again", function (e) {
        e.preventDefault();
        var $button = $(this);
        if (!$button.hasClass("disabled")) {
            $button.addClass("disabled");
            $("#" + $(this).data("form")).submit();
        }
    });
    $body.on("click", ".streets-list li", function () {
        var $this = $(this);
        ms.setStreet($this);
    });

/* здесь принята попытка переходить курсором с инпута в Списке улиц на сопутствующий список div,
если таковой имеется.
*/
/*
    $("#checkout_street").keypress(function(e){
        if (e.keyCode === 40) {
            var $elem = $(this).next("#streets-list").find("ul li:first");
//            alert($elem.html());
            $elem.css("background-color", "#fff2cc");
            $elem.hover().focus();
        }
    });
    $("#streets-list").keypress(function(e){
        if (e.keyCode === 40) {
            alert("pressed down!");
        }
    });
*/
/*      удалена в связи с отменой ТИПОВ шаблонов адресов
    $body.on("click", ".js-tmpl-insert", function (e) {
        var value = $(this).html();
        var index = $(this).attr('for').replace(/\D/g, '');
        var $input = $("#account_profile_tmpl_name-" + index);
        if ($input.val() == '') $input.val(value);
    });
*/
    $body.on("click", ".js-account-address-remove", function (e) {
        e.preventDefault();
        var $button = $(this);
        ms.removeAccountAddress($button);
    });
    $body.on("click", ".js-account-address-add", function (e) {
        e.preventDefault();
        var $button = $(this);
        ms.addAccountAddress($button);
    });
    $body.on("submit", "#account-profile-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.updateAccountProfile($form);
    });
    var $stepOne = $(".js-cart-step-one");
    if ($stepOne.length > 0 && $stepOne.parent().hasClass("active")) {
        ms.cartStepOne();
    }
    // изменение количества продуктов в корзине
    $body.on("click", ".js-cart-product-inc", function (e) {
        e.preventDefault();
        var $button = $(this);
        var disabled = $button.attr("disabled");
        var quantity = $button.prev().val();
        if ((typeof disabled === typeof undefined)&&(quantity < 99)) {
            ms.increaseCartItem($button);
        }
    });
    $body.on("click", ".js-cart-product-dec", function (e) {
        e.preventDefault();
        var $button = $(this);
        var disabled = $button.attr("disabled");
        if (typeof disabled === typeof undefined) {
            ms.decreaseCartItem($button);
        }
    });
    $body.on("click", ".js-cart-product-remove", function (e) {
        e.preventDefault();
        var $button = $(this);
        var disabled = $button.attr("disabled");
        if (typeof disabled === typeof undefined) {
            ms.removeCartItem($button);
        }
    });
    var  oldValProd, newValProd;
    $body.on("keypress", ".js-cart-product-count", function (e) {
        if(e.which == 13){
            e.preventDefault();
            $(this).blur();
        }
    });
    $body.on("focus", ".js-cart-product-count", function () {
        oldValProd = $(this).text();
    });
    $body.on("blur", ".js-cart-product-count", function (){
        var $span = $(this);
        newValProd = ($span.val().length != 0) ? $span.val() : 0;
        $span.val(newValProd);
        if ($span.val() == 0) {
            var $removeButton = $span.parents(".cart-product-item").find(".js-cart-product-remove");
            ms.removeCartItem($removeButton);
        } else {
            if (oldValProd != newValProd) {
                ms.setCartItem($span, newValProd - oldValProd);
            }
        }
    });
    // изменение количества ингридиентов и соусов в корзине
    $body.on("click", ".js-cart-add-product-inc", function (e) {
        e.preventDefault();
        var $button = $(this);
        var disabled = $button.attr("disabled");
        var quantity = $button.prev().val();
        if ((typeof disabled === typeof undefined)&&(quantity < 99)) {
            ms.increaseCartTopingItem($button);
        }
    });
    $body.on("click", ".js-cart-add-product-dec", function (e) {
        e.preventDefault();
        var $button = $(this);
        var disabled = $button.attr("disabled");
        if (typeof disabled === typeof undefined) {
            ms.decreaseCartTopingItem($button);
        }
    });
    $body.on("dblclick", ".js-cart-add-product-count", function (e) {
        e.preventDefault();
        $(this).val("");
    });
    var  oldValTopings, newValTopings;
    $body.on("keypress", ".js-cart-add-product-count", function (e) {
        e.preventDefault();
        if(e.which == 13){
            $(this).blur();
        }
    });
    $body.on("focus", ".js-cart-add-product-count", function () {
        oldValTopings = $(this).text();
    });
    $body.on("blur", ".js-cart-add-product-count", function (){
        var $span = $(this);
        newValTopings = ($span.text() > $span.data("quantity-default")) ? $span.text() : $span.data("quantity-default");
        $span.val(newValTopings);
        if (oldValTopings != newValTopings) {
            ms.setCartTopingItem($span, newValTopings-oldValTopings);
        }
    });

    // изменение количества палочек в корзине
    $body.on("click", ".js-cart-add-flatware-inc", function (e) {
        e.preventDefault();
        var $button = $(this);
        var disabled = $button.attr("disabled");
        var quantity = $button.prev().val();
        if ((typeof disabled === typeof undefined)&&(quantity < 99)) {
            ms.increaseCartFlatwareItem($button);
        }
    });
    $body.on("click", ".js-cart-add-flatware-dec", function (e) {
        e.preventDefault();
        var $button = $(this);
        var disabled = $button.attr("disabled");
        if (typeof disabled === typeof undefined) {
            ms.decreaseCartFlatwareItem($button);
        }
    });
    $body.on("dblclick", ".js-cart-flatware-count", function (e) {
        e.preventDefault();
        $(this).val("");
        /*        $(this).focus();
         var r = document.createRange();
         r.selectNodeContents(this);
         document.getSelection().addRange(r);*/
        //alert (r);
    });
    var  oldVal, newVal;
    $body.on("keypress", ".js-cart-flatware-count", function (e) {
        if(e.which == 13){
            e.preventDefault();
            $(this).blur();
        }
    });
    $body.on("focus", ".js-cart-flatware-count", function () {
        oldVal = $(this).text();
    });
    $body.on("blur", ".js-cart-flatware-count", function (){
        var $span = $(this);
        newVal = ($span.text() > $span.data("quantity-default")) ? $span.text() : $span.data("quantity-default");
        $span.val(newVal);
//        alert ((oldVal === newVal) ? "Значение не изменилось!" : "Разница составляет " + (newVal-oldVal));
        if (oldVal != newVal) {
            ms.setCartFlatwareItem($span, newVal-oldVal);
        }
    });

    $body.on("submit", "#catalog-filter-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.doCatalogFilter($form);
    });
    $body.on("click", ".js-cities-list a", function (e) {
        e.preventDefault();
        var $this = $(this);
        var changeCityLink = $this.attr("href");
        ms.changeCity(changeCityLink);
    });
    $body.on("click", ".js-change-city-confirm", function (e) {
        e.preventDefault();
        var $this = $(this);
        ms.changeCityConfirm($this);
    });
    $("#stock-modal").on("show.bs.modal", function (e) {
        var $button = $(e.relatedTarget);
        ms.getAction($button);
    });
    $body.on("click", ".js-get-prev-action, .js-get-next-action", function (e) {
        e.preventDefault();
        var $button = $(this);
        ms.getAction($button);
    });
    $body.on("click", ".js-catalog-reset-filter", function (e) {
        e.preventDefault();
        ms.clearCatalogFilters();
    });
    $body.on("click", ".js-step-one-checkout", function (e) {
        e.preventDefault();
        var $button = $(this);
        $button.attr("disabled", "disabled");
        var $form = $("#cart-step-one-form");
        if ($button.data("ignore-gift")) {
            $form.append('<input type="hidden" name="cart_step_one_ignore_gift" value="true" />');
        }
        ms.checkCartStopOne($form);
    });
    $body.on("click", ".js-add-gift-to-cart", function (e) {
        e.preventDefault();
        var $button = $(this);
        ms.addGiftToCart($button);
    });
    $body.on("click", ".js-add-gift-to-cart-random", function (e) {
        e.preventDefault();
        ms.addGiftToCartRandom();
    });
    $body.on("click", ".js-add-to-cart-offer", function (e) {
        e.preventDefault();
        var $button = $(this);
        ms.addToCartOffer($button);
    });

    $body.on("click", ".js-product-group-select", function (e) {
        e.preventDefault();
        var $this = $(this);
        ms.changeProductGroupItem($this);
    });
// вызов списка улиц
    $body.on("keyup", ".js-street-autocomplete", function (e) {
        if (e.keyCode != 40) {
            $("#addresses-list").addClass("hidden");
            var $this = $(this);
            if ($this.val().length >= 3) {
                ms.getStreets($this.val(), $this);
            } else {
                if ($this.hasClass("from-favorite-address")) {
                    $("#checkout_street").attr("data-street-code", "");
                    $("#checkout_house_number").val("");
                    $("#checkout_porch").val("");
                    $("#checkout_floor").val("");
                    $("#checkout_flat").val("");
                    $this.removeClass("from-favorite-address");
                }
            }
        }
    });
// очистка Ближайшего времени, любимого адреса и номеров: дом, подъезд и т.д. при СМЕНЕ улицы
    $body.on("change", ".js-street-autocomplete", function (e) {
        $("#guarantee_delivery_box").hide(400).removeClass("in").find('#guarantee_delivery_accept').removeAttr('checked');
        $("#checkout_house_number").val("");
        $("#checkout_porch").val("");
        $("#checkout_floor").val("");
        $("#checkout_flat").val("");
        $("#checkout_template-styler .jq-selectbox__dropdown ul li:first").click();
    });
// убираем список времени доставки при клике на улицу
    $body.on("click", ".js-street-autocomplete", function (e) {
        $(".tab-pane.active").find(".time-list").remove();
        $('#checkout_delivery_time').removeAttr("disabled");
    });
// скрываем список улиц, если улица пустая
    $body.on("blur", ".js-street-autocomplete", function (e) {
        if ($(this).val() == "") {
            $(".tab-pane.active #streets-list").remove();
        }
    });

    $body.on("click", ".js-cart-step-two", function (e) {
        e.preventDefault();
        $(".js-step-one-checkout").click();
    });
    $body.on("click", ".js-order-history-repeat", function (e) {
        e.preventDefault();
        var $this = $(this);
        ms.repeatOrder($this);
    });
    $body.on("keyup", "#cart_step_one_birthday", function (e) {
        if (e.keyCode != 9) {
            ms.checkUserBirtday();
        }
    });
    $body.on("focusout", "#checkout_house_number", function (e) {
        e.preventDefault();
        var street = $("#checkout_street").data("street-code");
        var house = $("#checkout_house_number").val();
        ms.getDeliveryCost(street, house);
    });
    // смена даты доставки
    $body.on("change", "#checkout_delivery_date", function (e) {
        var deliveryDate = $(".tab-pane.active").find('.jq-selectbox__select-text').text();
        var $deliveryTime = $(".tab-pane.active").find('#checkout_delivery_time');
        $deliveryTime.removeAttr("disabled");
        if ((deliveryDate.indexOf("Сегодня")>-1) && $("#guarantee_delivery_box").hasClass('in')) {
            $("#guarantee_delivery_box").show(400).find('#guarantee_delivery_accept').removeAttr('checked');
        } else {
            $("#guarantee_delivery_box").hide(400);
        }
        $(".time-list").remove();
        if (deliveryDate.indexOf("Сегодня")==-1) {
            ms.getDeliveryTimes($("#checkout_delivery_time"));
        } else {
            var tv = (ms.modals.$endOrdersModal) ? ms.modals.$endOrdersModal.data("tv") : '';
            ms.getBlockingTV(tv, "#checkout_delivery_time");
        }
        //ms.getDeliveryTimes($("#checkout_delivery_time"));
    });
    // смена даты самовывоза
    $body.on("change", "#checkout_pickup_date", function (e) {
        var deliveryDate = $(".tab-pane.active").find('.jq-selectbox__select-text').text();
        $(".time-list").remove();
        if (deliveryDate.indexOf("Сегодня")==-1) {
            ms.getDeliveryTimes($("#checkout_pickup_time"));
        } else {
            var tv = (ms.modals.$endOrdersModal) ? ms.modals.$endOrdersModal.data("tv") : '';
            ms.getBlockingTV(tv, "#checkout_pickup_time");
        }
        //ms.getDeliveryTimes($("#checkout_pickup_time"));
    });
    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
        $("#invoice-shipping-total").remove();
        $("#checkout_street").data("street-code", "");
        $("#checkout_house_number").val("");
        $("#checkout_floor").val("");
        $("#checkout_porch").val("");
        $("#checkout_flat").val("");
        $("#checkout_delivery_time").val("");
        $("#checkout_pickup_place").val("");
        $("#checkout_pickup_time").val("");
        setTimeout(function () {
            $("#checkout_pickup_place").trigger("refresh");
        }, 1);
        ms.recalcInvoice();
    });
    $body.on("keyup", "#invoice-bonus-total input", function (e) {
        var $this = $(this);
        var max = parseFloat($this.attr("max"));
        var value = $this.val();
        if (value.match(/[^0-9\.\,]/g)) {
            value = value.replace(/[^0-9\.\,]/g, "");
            $this.val(value);
        }
        value = value.replace(",", ".");
        $this.val(value);
        var dotsCount = (value.match(/\./g) || []).length;
        if (dotsCount > 1) {
            value = value.substring(0, value.length - 1);
            $this.val(value);
        }
        value = parseFloat(value);
        if (value > max) {
            $this.val(max);
        }
        ms.recalcInvoice();
    });
/*    $body.on("hide.bs.modal", "#error-common", function (e) {
        var $modal = $(this);
    });*/
    $body.on("hide.bs.modal", ".modal", function (e) {});
    $body.on("hide.bs.modal", "#news-modal, #stock-modal, #cart-item-modal, #your-code-modal", function (e) {
        var link = window.location.protocol + "//" + window.location.hostname + window.location.pathname;
        window.history.pushState("", null, link);
    });
    $body.on("keyup", "#checkout_name", function (e) {
        var inputVal = $(this).val();
        $("#checkout_pickup_name").val(inputVal);
    });
    $body.on("keyup", "#checkout_pickup_name", function (e) {
        var inputVal = $(this).val();
        $("#checkout_name").val(inputVal);
    });
    $body.on("keyup", "#checkout_comment", function (e) {
        var inputVal = $(this).val();
        $("#checkout_pickup_comment").val(inputVal);
    });
    $body.on("keyup", "#checkout_pickup_comment", function (e) {
        var inputVal = $(this).val();
        $("#checkout_comment").val(inputVal);
    });
    // Кнопка Оформить заказ в корзине, шаг 2
    $body.on("click", ".js-step-two-checkout", function (e) {
        e.preventDefault();
        var $button = $(this);
        $button.attr("disabled", "disabled");
        ms.checkCartStepTwo();
    });
    $body.on("submit", "#order-confirm-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.orderConfirm($form);
    });
    $body.on("click", ".radiobtn + label", function (e) {
        var $this = $(this);
        var $checkbox = $this.parents(".filter-group").find(":checked");
        if ($checkbox.length > 0) {
            var type = $checkbox.data("type");
            var clickedType = $this.prev().data("type");
            if (clickedType != type) {
                $this.parents(".filter-group").find('[data-type="' + type + '"]').removeAttr("checked");
            }
        }
    });
    $body.on("click", ".js-choose-city", function (e) {
        e.preventDefault();
        var link = $(this).attr("href");
        if (ms.supportLocalStorage()) {
            localStorage.setItem("startCityLink", link);
        }
        if (link) {
            ms.clearCart(link);
        }
    });
    $body.on("keydown", ".js-delivery-time-refresh", function (e) {
        return false;
    });
    $body.on("click", ".js-delivery-time-refresh", function (e) {
        e.preventDefault();
        var deliveryDate = $(".tab-pane.active").find('.jq-selectbox__select-text').text();
        if (deliveryDate.indexOf("Сегодня")==-1) {
            ms.getDeliveryTimes($(this));
        } else {
            var tv = (ms.modals.$endOrdersModal) ? ms.modals.$endOrdersModal.data("tv") : '';
            ms.getBlockingTV(tv, this);
        }
    });
// вызов модалки Гарантированная доставка
    $('#guarantee_delivery_accept').on ("click", function(){
        var $deliveryTime = $(".tab-pane.active").find("#checkout_delivery_time");
        var $guaranteeModal = $("#guarantee-delivery-modal");
        $guaranteeModal.find("#guarantee_time").html($(this).attr("data-time"));
        if ($(this).attr("checked")){
            $(this).removeAttr('checked');
            $deliveryTime.removeAttr("disabled");
        } else {
            $(this).removeAttr('checked');
            $guaranteeModal.modal("show");
        }
    });
// кнопка "Согласен" в модалке Гарантированная доставка
    $("#js-guarantee-agree").on("click", function (e) {
        $('#guarantee_delivery_accept').prop("checked", "checked").attr("checked", "checked");
        $(".tab-pane.active").find("#checkout_delivery_time").val("").attr("disabled","disabled");
        $(".tab-pane.active").find(".time-list").remove();
        $(this).parents(".modal.fade.in").modal("hide");
    });
// кнопка "Показать еще" в Отзывах
    $(".js-comments-show-else").on("click", function (e) {
        e.preventDefault();
        var $button = $(this);
        ms.commentsShowElse($button);
    });

    $body.on("click", ".time-list li", function () {
        var $this = $(this);
        ms.setTime($this);
    });
    $(".modal").on("shown.bs.modal", function () {
        $(this).find(":input:first").focus();
    });
    $("#login").on("show.bs.modal", function (e) {
        var $button = $(e.relatedTarget);
        var $modal = $(this);
        var activeTab = $button.data("tab") || false;
        if (activeTab) {
            $modal.find('a[href="' + activeTab + '"]').click();
        }
    });
    if ($(".cart-delivery-nav").length > 0) {
        ms.getDeliveryDates("", "", "delivery");
        ms.getDeliveryDates("", "", "pickup");
        ms.recalcInvoice();
        var $fatalError = $("#fatal-error");
        if ($fatalError.length > 0) {
            ms.showErrorModal($fatalError.val());
        }
    }
    var $searchPage = $(".search-page");
    if ($searchPage.length > 0) {
        var searchTerm = $searchPage.find('input[name="term"]').val();
        $searchPage.removeHighlight();
        if (searchTerm) {
            $searchPage.highlight(searchTerm);
        }
    }
    $("#comment").on("hide.bs.modal", function (e) {
        var $modal = $(this);
        ms.clearFormInput($modal);
        $modal.find(".file_upload").find("button").text("Прикрепить файл");
    });
    $("#callback-modal").on("hide.bs.modal", function (e) {
        var $textarea = $(this).find("textarea");
        $textarea.val("");
//        var $modal = $(this).find("textarea");
//        ms.clearFormInput($modal);
    });
    $("#error-common").on("hide.bs.modal", function (e) {
        var $modal = $(this);
        $modal.removeClass("opened");
    });
/*
    $body.on("focus", ".js-street-autocomplete", function (e) {
        var $addresses = $(this).next();
        if ($addresses.hasClass("cart-addresses-list") && $addresses.find("li").length > 0) {
            $addresses.removeClass("hidden");
        }
    });
*/
// Прописываем любимые адреса
    $body.on("click", "#addresses-list li, #checkout_template-styler .jq-selectbox__dropdown ul li:not(:first)", function (e) {
        $(".tab-pane.active #streets-list").remove();
        var $this = $(this);
        ms.setAddress($this);
    });
    $body.on("focus", "#checkout_name, #checkout_house_number, #checkout_porch, #checkout_floor, #checkout_flat, #checkout_delivery_time", function (e) {
        var $street = $(".js-street-autocomplete");
        if ($street.attr("data-street-code").length == 0 && $street.val().length > 0) {
            ms.showErrorModal("Вы указали неверную улицу. Для этого выберите улицу из списка.");
            $street.val("");
            $street.data("street-code", "");
        }
    });
    $body.on("click", "#login #uLogin a", function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.parents("#login").find(".loader-box").show();
    });
    $body.on("submit", "#promo-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        ms.activatePromo($form);
    });
    // кнопка Воспользоваться акцией в ЛК - Индивидуальное предложение
    $body.on("click", ".js-ind-offer", function (e) {
        ms.loaderShow();
    });
    // вызов кнопок выбора способа онлайн-оплаты
    $body.on("click", "#checkout_payment_online", function (e) {
        $onlines = $(this).parents('.container').find('.checkout_online_payment');
        $("#checkout-invoice").hide().addClass('col-sm-offset-2 col-md-offset-3 col-lg-offset-4');
        $onlines.show(400, 'linear', function(){
            $("#checkout-invoice").fadeIn(400);
        });
        $onlines.find('input').removeAttr("checked");
    });
    $body.on("click", "#checkout_payment_cash, #checkout_payment_card", function (e) {
        $onlines = $(this).parents('.container').find('.checkout_online_payment');
        $("#checkout-invoice").hide().removeClass('col-sm-offset-2 col-md-offset-3 col-lg-offset-4');
        $onlines.fadeOut(400, 'linear', function(){
            $("#checkout-invoice").fadeIn(400);
        }).find('input').removeAttr("checked");
    });
    // обработка формы "Интервью"
    $body.on("submit", "#interview-form", function(e) {
        e.preventDefault();
        var $form = $(this);
        ms.sendInterview($form);
    });
    $body.on("click", "#interview-form button", function(e) {
        localStorage["ms.modalInterview.ban"] = true;
    });

    ms.checkHash();
    ms.checkSocials();
});
