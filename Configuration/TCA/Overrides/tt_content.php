<?php

defined('TYPO3') or die();

(function () {
    // Register plugin
    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        'AisteaQr',
        'Qrcode',
        'Aistea QR'
    );

    // Add FlexForm
    $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist']['aisteaqr_qrcode'] = 'pi_flexform';
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
        'aisteaqr_qrcode',
        'FILE:EXT:aistea_qr/Configuration/FlexForms/Qrcode.xml'
    );
})();
