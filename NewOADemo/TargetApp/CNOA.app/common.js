/**
 * 初始化表单
 * @type 
 */
var nameDisallowBlank = true;
var flowForm = {
	initForm: function(msg, from){
		var me = this;
		
		//设置表单基本信息
		var flowInfo = msg.flowInfo;
		var it_flowName = $('#flowName');
		var it_flowNumber = $('#flowNumber');
		var it_level = $('#level');
		var it_reason = $('#reason');
		var it_uname = $('#uname');
		var it_posttime = $('#posttime');

		if(flowInfo.nameDisallowBlank == '0'){
			nameDisallowBlank = false;
		}
		
		it_flowName.val(flowInfo.flowName);
		it_flowNumber.val(flowInfo.flowNumber);
		it_level.val(flowInfo.level);
		it_reason.val(flowInfo.reason);
		it_uname.val(flowInfo.uname);
		it_posttime.val(flowInfo.posttime);
		
		it_flowNumber.attr("disabled", true);
		it_uname.attr("disabled", true);
		it_posttime.attr("disabled", true);
		
		if (from == 'new') {
			it_uname.parent().hide();
			it_posttime.parent().hide();
			it_reason.parent().removeClass('input-group-space');
			it_flowName.attr("disabled", false);
			it_level.attr("disabled", false);
			it_reason.attr("disabled", false);
		} else {
			$(".flowOtherBtns").css("display", "inline-block");
			it_flowName.attr("disabled", true);
			it_level.attr("disabled", true);
			it_reason.attr("disabled", true);
		}
		
		//生成表单控件HTML
		var html = [];
		$.each(msg.formInfo.items, function(id, widget){
			var item = [
				'<div class="form-group">',
				'<div class="form-label">',
				'<label>',widget.label,'</label>',
				'</div>',
				'<div class="form-input',( widget.must ? ' must' : ''),'">',
				me.createWidgetHTML(widget),
				'</div>',
				'</div>'
			];
			html.push(item.join(""));
		});
		$("#form").append(html.join(""));
		
		//美化check/radio的样式
		$(':checkbox').cInit();
		$(':radio').rInit();
		
		//绑定事件
		this.bindWidgetEvent();
	},
	
	//创建控件的HTML
	createWidgetHTML: function(widget){
		var html = '';
		switch (widget.tag){
			case 'textfield':
				html += this.getTextfieldHTML(widget);
				break;
			case 'textarea':
				html += this.getTextareaHTML(widget);
				break;
			case 'radio':
				html += this.getRadioHTML(widget);
				break;
			case 'checkbox':
				html += this.getCheckboxHTML(widget);
				break;
			case 'select':
				html += this.getSelectHTML(widget);
				break;
			case 'macro':
				html += this.getMacroHTML(widget);
				break;
			case 'choice':
				html += this.getChoiceHTML(widget);
				break;
			case 'detailtable':
				html += this.getDetailTableHTML(widget);
				break;
		}
		
		return html;
	},

	//单行文本
	getTextfieldHTML: function(widget){
		var html = [
			'<input',
			'class="form-control"',
            'tag="textfield"',
            'id="' + widget.name + '"',
			'value="' + widget.value + '"'
		];
		if(widget.readOnly){
			html.push('disabled="disabled"');
		} else {
			html = html.concat([
				'name="' + widget.name + '"',
				'dataType="' + widget.dataType + '"',
				( widget.thousands ? 'thousands="'+widget.thousands+'"' : '' ),
				( widget.autoCompleteDecimal ? 'autoCompleteDecimal="'+widget.autoCompleteDecimal+'"' : ''),
				( widget.decimalPrecision ? 'decimalPrecision="'+widget.decimalPrecision+'"' : '')
			]);
		}
		html.push('/>');
		
		return html.join(' ');
	},
	
	//多行文本
	getTextareaHTML: function(widget){
		var html = [
			'<textarea',
			'class="form-control"',
			'tag="textarea"',
			( widget.readOnly ? 'disabled="disabled"' : ('name="'+widget.name+'"') ),
			'>' + widget.value + '</textarea>'
		];
		return html.join(' ');
	},
	
	//单选框
	getRadioHTML: function(widget){
		var html = [];
		$.each(widget.items, function(i, item){
			html = html.concat([
				'<label class="radio-inline">',
				'<input type="radio" tag="radio" value="'+item.value+'" ',
				( item.checked ? 'checked' : '' ),
				( widget.readOnly ? 'disabled="disabled"' : ('name="'+widget.name+'"') ),
				' />' + item.label + '</label>'
			]);
		})
		return html.join(' ');
	},
	
	//多选框
	getCheckboxHTML: function(widget){
		var html = [];
		$.each(widget.items, function(i, item){
			html = html.concat([
				'<label class="checkbox-inline">',
				'<input type="checkbox" tag="checkbox" value="'+item.value+'" ',
				( item.checked ? ' checked' : '' ),
				( widget.readOnly ? 'disabled="disabled"' : ('name="'+widget.name+'_'+item.value+'"') ),
				' />' + item.label + '</label>'
			]);
		})
		return html.join(' ');
	},
	
	//下拉框	
	getSelectHTML: function(widget){
		var html = [
			'<select class="form-control"',
			'tag="select"',
			( widget.readOnly ? 'disabled="disabled"' : ('name="'+widget.name+'"') ),
			'>'
		];
		$.each(widget.items, function(i, item){
			html.push('<option value="'+item.value+'"'+( item.selected ? ' selected' : '' )+'>' + item.label + '</option>');
		});
		html.push('</select>');
		return html.join(' ');
	},
	
	//宏控件
	getMacroHTML: function(widget){
		if (widget.dataType == 'loginname') {
			var html = [
				 '<input class="form-control"',
				 'tag="macro"',
				 'disabled="disabled"',
				 'value="' + widget.displayValue + '"',
				 '/>'
			];
			if (!widget.readOnly) {
				html.push('<input type="hidden" value="' + widget.value + '" ' +
					'tag="macro" ' +
					'dataType="' + widget.dataType + '" ' +
					'name="' + widget.name + '" />');
			}
			
		} else if(widget.dataType == 'attLeave') {
			var html = [
				 '<input class="form-control"',
				 'tag="macro"',
				 'id="' + widget.name + '"',
				 'readOnly="readOnly"',
				 'dataType="' + widget.dataType + '"',
				 'value="' + widget.value + '"',
				 'onclick="JavaBridge.showAttLeaveCtrl(this);"',
				 'name="'+widget.name+'"',
				 '/>'
			];
		} else {
			var html = [
				 '<input class="form-control"',
				 'tag="macro"',
				 'disabled="disabled"',
				 'dataType="' + widget.dataType + '"',
				 'value="' + widget.value + '"',
				 ( widget.readOnly ? '' : ('name="'+widget.name+'"') ),
				 '/>'
			];
		}
		
		return html.join(' ');
	},
	
	//选择器
	getChoiceHTML: function(widget){
		var html = [
			'<input',
			'class="form-control"',
			'tag="choice"',
			'dataType="' + widget.dataType + '"',
			'id="' + widget.name + '"',
			'value="' + widget.displayValue + '"',
			(widget.readOnly ? 'disabled="disabled"' : 'readonly style="background-color:#FFFFFF;"') //可填时，为readonly，防止用户自己输入
		];
		switch(widget.dataType){
			case 'date':
			case 'time':
				html.push('format="' + widget.format + '"');
				html.push('onclick="JavaBridge.showDateTime(this);"');
				break;
			case 'user':
			case 'dept':
			case 'station':
			case 'job':
				html.push('multi="' + widget.multi + '"');
				html.push('onclick="JavaBridge.showSelector(this);"');
				break;
		}
		html.push('/>');
		//不是只读时，插入隐藏标签
		if(!widget.readOnly){
			html = html.concat([
				'<input type="hidden"',
				'name="'+widget.name+'"',
				'value="'+widget.value+'" />'
			]);
		}
		//人员选择器，附加上隐藏表单以供后台判断下一步万一有本控件的经办人的情况
		if(widget.dataType == "user" && !widget.multi){
			html = html.concat([
				'<input type="hidden"',
				'datatype="user_sel"',
				'oname="'+widget.name+'"',
				'value="'+widget.value+'" />'
			]);
		}
		return html.join(' ');
	},

	//明细表
	getDetailTableHTML: function(widget){
		var html = [
			'<button style="width:100%;" onclick="JavaBridge.showDetailTable('+widget.tableId+');return false;">',
			'查看明细表',
			'</button>'
		];
		return html.join('');
	},
	
	//绑定控件事件
	bindWidgetEvent: function(){
		var me = this;
		//单行文本(数组类型)
		$('input[tag=textfield][datatype=int]').each(function(i){
			if(this.getAttribute('thousands')=='true'){
				me.toNumberfield($(this), 0, false, true);
			}else{
				me.toNumberfield($(this));
			}
		});
		$('input[tag=textfield][datatype=float]').each(function(){
			var decimalPrecision = this.getAttribute('decimalPrecision') || 0,
				thousands = this.getAttribute('thousands')=='true' ? true : false,
				autoComplete = this.getAttribute('autoCompleteDecimal')=='true' ? true : false;
			me.toNumberfield($(this), decimalPrecision, autoComplete, thousands);
		});
		
		// 多行文本自适应高度
		$('textarea[tag=textarea]').each(function(){
			me.updateTextareaHeight(this);
			if (this.addEventListener) {
				this.addEventListener('input', function(){ me.updateTextareaHeight(this);}, false);
			} else {
				this.onpropertychange = function(){ me.updateTextareaHeight(this) };
			}
		});
	},
	
	/**
	 * 数字控件
	 * @param {object} comp				标签
	 * @param {int} decimalPrecision	小数点位数
	 * @param {boolean} autoComplete	是否自动补齐
	 * @param {boolean} thousands		千分制
	 */
	toNumberfield: function(comp, decimalPrecision, autoComplete, thousands){
		var me = this;
		if(!thousands) thousands = false;
		if(!autoComplete) autoComplete = false;
		if(!decimalPrecision) decimalPrecision = 0;
		
		//验证可输入键（数字, -, .）
		comp.bind('keypress', function(){
			var code = event.keyCode,
				pos = this.selectionStart,
				dot = this.value.indexOf('.');
            if(code == 46 && decimalPrecision!=0 && !autoComplete){ //是否有小数点
            	//小数点只能出现一次,并且不能在第一位
                if(dot!=-1 || pos==0){
                    return false;  
                }
                
            } else if (pos==0 && code==45 && this.value.indexOf("-")==-1){ //负号只能在最前面
            	return true;
            	
            } else if (this.value[0]=='-' && pos==0){ //负号前面不能输入
            	return false;
            	
            } else {
                return event.keyCode>=48&&event.keyCode<=57;  
            }
		});
		
		comp.bind('keyup', function(){
			var pos = this.selectionStart,
				code = event.keyCode,
				val = this.value,
				dot = val.indexOf('.'),
				intPart = val,
				decimalPart = '';
			if(dot!=-1){
				intPart = val.substr(0, dot);
				decimalPart = val.substr(dot, decimalPrecision+1);
			}
			//千分制
			if(thousands){
				intPart = intPart.replace(/,/g, '');
				intPart = me.toThousands(intPart.replace(',', ''));
			}
			//自动补齐
			if(autoComplete){
				var len = decimalPrecision;
				decimalPart = '.';
				for(; len>0; len--){
					decimalPart += '0';
				}
			}
			this.value = intPart+decimalPart;
			this.setSelectionRange(pos, pos); //保存位置
		});
		comp.bind('blur', function(){
			//去除末尾小数点
			if(this.value.charAt(this.value.length-1)=='.'){
				this.value = this.value.slice(0, -1);
			}
			if(this.value[0]=='.'){
				this.value = '';
			}
		});
	},
	
	//数字转为千分制
	toThousands: function(val){
		var minus = '';
		if(val[0]=='-'){
			minus = '-';
			val = val.substr(1);
		}
		var len = val.length, j=len-1; text='',i=0;
		for(; j>=0; j--){
			text = val[j]+text;
			i++;
			if(!(i%3) && i!=len){
				text = ','+text;
			}
		}
		return minus+text;
	},
	// textarea自适应高度
	updateTextareaHeight: function(th) {
		th.style.height = th.scrollHeight + 'px';
	}
};

var JavaBridge = {
	showDateTime: function(th){
		obcInvoke.showDateTimeFormatAndId(th.getAttribute('format'), th.getAttribute('id'));
	},
	
	setDateTime: function(date, to){
		$('#'+to).val(date);
		$('input[name='+to+']').val(date);
	},

	//显示明细表WebView
	showDetailTable: function(tableId){
		obcInvoke.showDetailTable(tableId);
	},

	//显示流程步骤信息
	showFlowStep: function(){
		obcInvoke.showFlowStep();
	},

	//显示流程事件信息
	showFlowEvent: function(){
		obcInvoke.showFlowEvent();
	},
	
	//显示考勤请假时间(开始时间至结束时间)
	showAttLeaveCtrl: function(th){
		obcInvoke.showAttLeaveCtrl(th.getAttribute('id'));
	},
	
	setAttLeaveCtrl: function(date, to){
		$('#'+to).val(date);
		$('input[name='+to+']').val(date);
    },
    
    setAttValue: function(value, to){
        $('#wf_field_'+to).val(value);
        console.log($('#wf_field_'+to));
    },
	
	//获取选择器
	showSelector: function(th){
		var multi = th.getAttribute('multi')=='true' ? 'YES' : 'NO',
			id = th.getAttribute('id'),
			value = $('input[name='+id+']').val();
       // alert(multi);
		obcInvoke.showSelectorMultiValueAndId(th.getAttribute('dataType'), multi, value, id);
	},
	
	setSelectorValue: function(value, rawValue, to){
		$('#'+to).val(rawValue);
		$('input[name='+to+']').val(value);
		
		//人员选择器，附加上隐藏表单以供后台判断下一步万一有本控件的经办人的情况
		var user_sel_el = $('input[oname='+to+'][datatype=user_sel]');
		if(user_sel_el.length == 1){
			user_sel_el.val(value);
		}
	},
    
    getFormValues: function(){
        var data = {};
        //流程基本信息
       // if (from == 'new') {
            data['flowNumber'] = $('#flowNumber').val();
            data['flowName'] = $('#flowName').val();
            data['level'] = $('#level').val();
            data['reason'] = $('#reason').val();
       // }
        
        //表单数据
        $("#form [name]").each(function() {
			if (this.type && (jQuery.inArray(this.type, ['radio', 'checkbox']) == -1)) {
				data[this.name] = this.value;
			}
		});
        //获取select标签
        $('#form select').each(function() {
			data[this.name] = this.value;
		});
        //获取radio标签
        $('#form input:radio:checked').each(function() {
			data[this.name] = this.value;
		});
        //获取checkbox标签
        $('#form input:checkbox[checked=checked]').each(function() {
			data[this.name] = this.value;
		});
		//人员选择器
		var user_sel = [];
		$('input[datatype=user_sel]').each(function() {
			user_sel.push($(this).attr('oname') + "=" + this.value);
		});
		if(user_sel.length>0){
			data['user_sel'] = user_sel.join("|");
		}

        return data;
    },
	
	//检查表单
	checkForm: function(type) {
		//type:1 同意 、4保留意见箱

		if (nameDisallowBlank && $('#flowName').val() == '') {
			alert("流程名称不能为空");
			//window.javaInterface.checkForm(false);
			return;
		}
		
		//表单数据
		var inputs = $("#form .form-input");
		for (var i = 0; i < inputs.length; i++) {
			var th = $(inputs[i]);
			var input = th.find('[name]')[0];
			if (th.hasClass('must') && input.value=='') {
				var widgetName = th.prev().text().trim();
				alert('[' + widgetName + ']为必填');
				//window.javaInterface.checkForm(false);
				return;
			}
		}
        
        var values = JavaBridge.getFormValues();
    	switch(type){
            case 1:
    		 $("#type").val("agree");
    		 break;
            case 4:
    		 $("#type").val("keep");
    		 break;
    	}
        var jsonStr = JSON.stringify(values);
		obcInvoke.checkForm(jsonStr);
	},
	
	//提交表单
	submitForm: function(from){
	
		var data = {};
		//流程基本信息
		if (from == 'new') {
			data['flowNumber'] = $('#flowNumber').val();
			data['flowName'] = $('#flowName').val();
			data['level'] = $('#level').val();
			data['reason'] = $('#reason').val();
		}
		data['type'] = $('#type').val();
		
		//表单数据
		$("#form [name]").each(function() {
			if (this.type && (jQuery.inArray(this.type, ['radio', 'checkbox']) == -1)) {
				data[this.name] = this.value;
			}
		});
		//获取select标签
		$('#form select').each(function() {
			data[this.name] = this.value;
		});
		//获取radio标签
		$('#form input:radio:checked').each(function() {
			data[this.name] = this.value;
		});
		//获取checkbox标签
		$('#form input:checkbox[checked=checked]').each(function() {
			data[this.name] = this.value;
		});
        var jsonStr = JSON.stringify(data);
        obcInvoke.submitForm(jsonStr);
	}
};
