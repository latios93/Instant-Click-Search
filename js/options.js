jQuery.fn.extend({
	scrollToMe: function () {
		var x = jQuery(this).offset().top - 100;
		jQuery('html,body').animate({scrollTop: x}, 600);
		}
	}
);

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

$(document).ready(function(){
	$('#settingsDescription').text(chrome.i18n.getMessage("extensionSettingDescription"));
	$('#settingsDescriptionGroupAll').text(chrome.i18n.getMessage("extensionSettingDescriptionGroupAll"));
	$('#save').text(chrome.i18n.getMessage("extensionSettingSave"));
	$('#add_host_name').text(chrome.i18n.getMessage("extensionSettingAddHostName"));
	$('#add_host_msg_1').text(chrome.i18n.getMessage("extensionSettingAddHostMSG_1"));
	$('#add_host_url').text(chrome.i18n.getMessage("extensionSettingSave"));	
	$('#add_host_url_optional').text(chrome.i18n.getMessage("extensionSettingAddHostURLOptional"));
	$('#add_host_url_final').text(chrome.i18n.getMessage("extensionSettingAddHostURLFinal"));
	$('#add_host_desc').text(chrome.i18n.getMessage("extensionSettingAddHostSave"));
	$('#add_host_save').text(chrome.i18n.getMessage("extensionSettingAddHostSave"));
	
	$('#add_host').click(save_extra);
	$('#save').click(save_options);	
	$('#TogetherMenus').click(selectAllCheckbox);	
	$('[data-toggle="tooltip"]').tooltip(); 
	$('tr').each(function(index, el){
		let index_class = randomColor(0,arrayClasses.length);
		$(this).addClass(arrayClasses[index_class]);
	});
	$('div.host > table > tbody > tr').click(function(event){
		$(this).find('td > input:checkbox').each(function (index, elem) {
			$(elem).click();
		});
	});
});