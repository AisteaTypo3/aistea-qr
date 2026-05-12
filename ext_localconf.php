<?php

defined('TYPO3') or die();

use TYPO3\CMS\Extbase\Utility\ExtensionUtility;
use Aistea\AisteaQr\Controller\QrCodeController;

call_user_func(function () {
    ExtensionUtility::configurePlugin(
        'AisteaQr',
        'Qrcode',
        [QrCodeController::class => 'redirect'],
        [QrCodeController::class => 'redirect']
    );

    $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']['processDatamapClass'][] =
        \Aistea\AisteaQr\Hooks\DataHandlerHook::class;

    $GLOBALS['TYPO3_CONF_VARS']['SYS']['formEngine']['nodeRegistry'][1684747380] = [
        'nodeName' => 'dynamicQrcodePreview',
        'priority' => 40,
        'class' => \Aistea\AisteaQr\Form\Element\QrPreviewElement::class,
    ];

    $GLOBALS['TYPO3_CONF_VARS']['SYS']['formEngine']['nodeRegistry'][1684747381] = [
        'nodeName' => 'dynamicQrcodeAnalytics',
        'priority' => 40,
        'class' => \Aistea\AisteaQr\Form\Element\QrAnalyticsElement::class,
    ];
});
