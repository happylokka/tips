(function(){
    class plugin {
        constructor(options) {
            this.options = options;

            this.init();
        }
        init() {
            this.createTips();

            this.open();
        }
        createTips() {
            this.tipsBox = document.createElement('div');
            this.tipsBox.className = `tips ${this.options.type}`;
            this.tipsIcon = document.createElement('span');
            this.tipsIcon.className = `iconfont icon-${this.options.type}`;
            this.tipsText = document.createElement('p');
            this.tipsText.innerHTML = this.options.message;
            this.tipsBox.appendChild(this.tipsIcon);
            this.tipsBox.appendChild(this.tipsText);
            document.body.appendChild(this.tipsBox);

            if(this.options.showClose) {

                this.closeBox = document.createElement('i');
                this.closeBox.className = 'close';
                this.closeBox.innerHTML = '×';
                this.tipsBox.appendChild(this.closeBox);
                
                this.closeBox.onclick = () => {
                    this.close();
                }
            }
            
            // 初始化 tipsBox
            this.initTipsBox();

            // 钩子函数
			this.options.oninit();
            
        }
        initTipsBox() {

            let tipsBoxs = document.querySelectorAll('.tips');
            let len = tipsBoxs.length;
            this.tipsHeight = this.tipsBox.offsetHeight;
            this.tipsBox.style.top = `${(20+this.tipsHeight)*(len-1)}px`;
            this.tipsBox.offsetHeight;

        }
        open() {
            this.tipsBox.style.top = `${parseInt(this.tipsBox.style.top) + 20}px`;
            this.tipsBox.style.opacity = 1;

            if(this.options.auto) {
                // 如果DURATION不为零，控制自动消失
			    this.autoTimer = setTimeout(() => {
			    	this.close();
                }, this.options.duration);
            }
            
            // 钩子函数
            this.options.onopen();
        }
        close() {
            if(this.options.auto) {
                clearTimeout(this.autoTimer);
            }
            this.tipsBox.style.top = '0';
            this.tipsBox.style.opacity = '0';
            let anonymous = () => {
                document.body.removeChild(this.tipsBox);
                this.tipsBox.removeEventListener('transitionend', anonymous);

                // 重新设置 所有 tips 的top
                this.resetTipsTop();

                // 钩子函数
                this.options.onclose();
            };
            this.tipsBox.addEventListener('transitionend', anonymous);

            return;
        }
        resetTipsTop() {
            let tipsBoxs = document.querySelectorAll('.tips');
            let len = tipsBoxs.length;
            for(let i = 0; i < len; i++) {
                tipsBoxs[i].style.top = `${20 + (20+this.tipsHeight)*i}px`;
            };
        }
    }

    window.tips = function tips(options = {}) {
        if (typeof options === "string") {
			options = {
				message: options
			};
		}
        options = Object.assign({
            message: '',
            type: 'info',
            auto: true,
            showClose: false,
            duration: 3000,
            oninit: function() {},
            onopen: function() {},
            onclose: function() {}
        },options)
        return new plugin(options);
    }
})()