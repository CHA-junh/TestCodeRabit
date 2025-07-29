'use client'

import React, { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

/**
 * PSM0060M00 - Í∞úÎ∞ú?òÍ≤Ω ?†ÌÉù ?ùÏóÖ
 * 
 * Í∞úÎ∞ú?êÏùò Í∏∞Ïà† ?§ÌÉùÍ≥?Í∞úÎ∞ú?òÍ≤Ω???†ÌÉù?òÎäî ?ùÏóÖ ?îÎ©¥?ÖÎãà??
 * ?ÑÎ°ú???±Î°ù ??Í∞úÎ∞ú?òÍ≤Ω ?ïÎ≥¥Î•??ÖÎ†•?òÍ∏∞ ?ÑÌïú Î™®Îã¨ ?ùÏóÖ?ºÎ°ú ?¨Ïö©?©Îãà??
 * 
 * Ï£ºÏöî Í∏∞Îä•:
 * - ?¥ÏòÅÏ≤¥Ï†ú(OS) ?†ÌÉù (UNIX, WINDOW, LINUX, Í∏∞Ì?)
 * - DBMS ?†ÌÉù (ORACLE, MS-SQL, DB2, Sybase, Informix, Í∏∞Ì?)
 * - ?ÑÎ†à?ÑÏõç ?†ÌÉù (Corebase, ProFrame, AnyFrame, Digital, Í∏∞Ì?)
 * - WAS/ÎØ∏Îì§?®Ïñ¥ ?†ÌÉù (JEUS, WebLogic, WebSphere, MTS, Tmax, Tuxedo, Í∏∞Ì?)
 * - ?∏Ïñ¥/Í∞úÎ∞ú?òÍ≤Ω ?†ÌÉù (Java, EJB, ASP, Proc, C, Ajax, Struts, iBatis, Spring, jQuery, HTML5, VB, PB, VC, Delphi, Í∏∞Ì?)
 * - TOOL ?†ÌÉù (Miplatform, Xplatform, NCRM, XFrame, Gause, RD, OZ, CR, Í∏∞Ì?)
 * - Î™®Î∞î???†ÌÉù (Android, iOS, Í∏∞Ì?)
 * - Í∏∞Ì? ?çÏä§???ÖÎ†•
 * 
 * AS-IS: Í∞úÎ∞ú?òÍ≤Ω ?†ÌÉù ?ùÏóÖ (MXML)
 * TO-BE: React Í∏∞Î∞ò ?ùÏóÖ Ïª¥Ìè¨?åÌä∏
 * 
 * ?¨Ïö© ?àÏãú:
 * ```tsx
 * // PSM0050M00?êÏÑú ?∏Ï∂ú
 * <PSM0060M00 
 *   onConfirm={(data) => setDevEnv(data)}
 *   onClose={() => setShowPopup(false)}
 * />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

interface PSM0060M00Props {
  /** ?†ÌÉù ?ÑÎ£å ???∏Ï∂ú??ÏΩúÎ∞± (?†ÌÉù??Í∞úÎ∞ú?òÍ≤Ω Î¨∏Ïûê???ÑÎã¨) */
  onConfirm?: (data: string) => void;
  /** ?ùÏóÖ ?´Í∏∞ ???∏Ï∂ú??ÏΩúÎ∞± */
  onClose?: () => void;
}

export default function PSM0060M00({ onConfirm, onClose }: PSM0060M00Props) {
  const { showToast, showConfirm } = useToast();
  // ?¥ÏòÅÏ≤¥Ï†ú(OS) ?ÅÌÉú
  const [osUnix, setOsUnix] = useState(false);
  const [osWindow, setOsWindow] = useState(false);
  const [osLinux, setOsLinux] = useState(false);
  const [osEtc, setOsEtc] = useState(false);
  const [osEtcText, setOsEtcText] = useState('');

  // DBMS ?ÅÌÉú
  const [dbOracle, setDbOracle] = useState(false);
  const [dbMssql, setDbMssql] = useState(false);
  const [dbDb2, setDbDb2] = useState(false);
  const [dbSybase, setDbSybase] = useState(false);
  const [dbInformix, setDbInformix] = useState(false);
  const [dbEtc, setDbEtc] = useState(false);
  const [dbEtcText, setDbEtcText] = useState('');

  // ?ÑÎ†à?ÑÏõç ?ÅÌÉú
  const [frameCorebase, setFrameCorebase] = useState(false);
  const [frameProFrame, setFrameProFrame] = useState(false);
  const [frameAnyFrame, setFrameAnyFrame] = useState(false);
  const [frameDigital, setFrameDigital] = useState(false);
  const [frameEtc, setFrameEtc] = useState(false);
  const [frameEtcText, setFrameEtcText] = useState('');

  // WAS/ÎØ∏Îì§?®Ïñ¥ ?ÅÌÉú
  const [wasJeus, setWasJeus] = useState(false);
  const [wasWeblogic, setWasWeblogic] = useState(false);
  const [wasWebSphere, setWasWebSphere] = useState(false);
  const [wasMts, setWasMts] = useState(false);
  const [wasTmax, setWasTmax] = useState(false);
  const [wasTuxedo, setWasTuxedo] = useState(false);
  const [wasEtc, setWasEtc] = useState(false);
  const [wasEtcText, setWasEtcText] = useState('');

  // ?∏Ïñ¥/Í∞úÎ∞ú?òÍ≤Ω ?ÅÌÉú
  const [langJava, setLangJava] = useState(false);
  const [langEjb, setLangEjb] = useState(false);
  const [langAsp, setLangAsp] = useState(false);
  const [langProc, setLangProc] = useState(false);
  const [langC, setLangC] = useState(false);
  const [langAjax, setLangAjax] = useState(false);
  const [langStruts, setLangStruts] = useState(false);
  const [langIBatis, setLangIBatis] = useState(false);
  const [langSpring, setLangSpring] = useState(false);
  const [langJQuery, setLangJQuery] = useState(false);
  const [langHtml5, setLangHtml5] = useState(false);
  const [langVb, setLangVb] = useState(false);
  const [langPb, setLangPb] = useState(false);
  const [langVc, setLangVc] = useState(false);
  const [langDelphi, setLangDelphi] = useState(false);
  const [langEtc, setLangEtc] = useState(false);
  const [langEtcText, setLangEtcText] = useState('');

  // TOOL ?ÅÌÉú
  const [toolMiplatform, setToolMiplatform] = useState(false);
  const [toolXplatform, setToolXplatform] = useState(false);
  const [toolNcrm, setToolNcrm] = useState(false);
  const [toolXframe, setToolXframe] = useState(false);
  const [toolGause, setToolGause] = useState(false);
  const [toolRd, setToolRd] = useState(false);
  const [toolOz, setToolOz] = useState(false);
  const [toolCr, setToolCr] = useState(false);
  const [toolEtc, setToolEtc] = useState(false);
  const [toolEtcText, setToolEtcText] = useState('');

  // Î™®Î∞î???ÅÌÉú
  const [mobileAndroid, setMobileAndroid] = useState(false);
  const [mobileIos, setMobileIos] = useState(false);
  const [mobileEtc, setMobileEtc] = useState(false);
  const [mobileEtcText, setMobileEtcText] = useState('');

  // Í∏∞Ì?
  const [etcText, setEtcText] = useState('');

  // ?ïÏù∏ Î≤ÑÌäº ?¥Î¶≠ ???∞Ïù¥???òÏßë Î∞??ÑÎã¨
  const handleConfirm = () => {
    const data: string[] = [];

    // ?¥ÏòÅÏ≤¥Ï†ú(OS)
    if (osUnix) data.push('UNIX');
    if (osWindow) data.push('WINDOW');
    if (osLinux) data.push('LINUX');
    if (osEtc && osEtcText) data.push(osEtcText);

    // DBMS
    if (dbOracle) data.push('ORACLE');
    if (dbMssql) data.push('MS-SQL');
    if (dbDb2) data.push('DB2');
    if (dbSybase) data.push('Sybase');
    if (dbInformix) data.push('Informix');
    if (dbEtc && dbEtcText) data.push(dbEtcText);

    // ?ÑÎ†à?ÑÏõç
    if (frameCorebase) data.push('Corebase');
    if (frameProFrame) data.push('ProFrame');
    if (frameAnyFrame) data.push('AnyFrame');
    if (frameDigital) data.push('?ÑÏûê?ïÎ?');
    if (frameEtc && frameEtcText) data.push(frameEtcText);

    // WAS/ÎØ∏Îì§?®Ïñ¥
    if (wasJeus) data.push('JEUS');
    if (wasWeblogic) data.push('Weblogic');
    if (wasWebSphere) data.push('WebSphere');
    if (wasMts) data.push('MTS(COM++)');
    if (wasTmax) data.push('T-MAX');
    if (wasTuxedo) data.push('Tuxedo');
    if (wasEtc && wasEtcText) data.push(wasEtcText);

    // ?∏Ïñ¥/Í∞úÎ∞ú?òÍ≤Ω
    if (langJava) data.push('JAVA,JSP');
    if (langEjb) data.push('EJB');
    if (langAsp) data.push('.NET,C#,ASP');
    if (langProc) data.push('PRO*C');
    if (langC) data.push('C,C++');
    if (langAjax) data.push('Ajax');
    if (langStruts) data.push('Struts');
    if (langIBatis) data.push('iBatis');
    if (langSpring) data.push('Spring');
    if (langJQuery) data.push('JQuery');
    if (langHtml5) data.push('HTML5');
    if (langVb) data.push('Visual Basic');
    if (langPb) data.push('Power Bulder');
    if (langVc) data.push('Visual C++');
    if (langDelphi) data.push('Delphi');
    if (langEtc && langEtcText) data.push(langEtcText);

    // TOOL
    if (toolMiplatform) data.push('Miplatform');
    if (toolXplatform) data.push('Xplatform');
    if (toolNcrm) data.push('NCRM');
    if (toolXframe) data.push('xFrame');
    if (toolGause) data.push('Gause');
    if (toolRd) data.push('RD(Report Design)');
    if (toolOz) data.push('OZ Report');
    if (toolCr) data.push('Crystal Report');
    if (toolEtc && toolEtcText) data.push(toolEtcText);

    // Î™®Î∞î??
    if (mobileAndroid) data.push('Android');
    if (mobileIos) data.push('IO/S');
    if (mobileEtc && mobileEtcText) data.push(mobileEtcText);

    // Í∏∞Ì?
    if (etcText) data.push(etcText);

    const result = data.join(', ');
    onConfirm?.(result);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[772px] h-[420px] flex flex-col">
        {/* ?§Îçî */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Í∞úÎ∞ú?òÍ≤Ω/DBMS/?∏Ïñ¥ ?¥Ïö© ?ÖÎ†•</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-xl font-bold"
          >
            √ó
          </button>
        </div>

        {/* Ïª®ÌÖêÏ∏?*/}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {/* ?¥ÏòÅÏ≤¥Ï†ú(OS) */}
            <div className="flex items-center border p-2">
              <div className="w-24 font-semibold text-sm">?¥ÏòÅÏ≤¥Ï†ú(OS)</div>
              <div className="flex-1 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={osUnix}
                    onChange={(e) => setOsUnix(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">UNIX</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={osWindow}
                    onChange={(e) => setOsWindow(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">WINDOW</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={osLinux}
                    onChange={(e) => setOsLinux(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">LINUX</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={osEtc}
                    onChange={(e) => setOsEtc(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Í∏∞Ì?</span>
                </label>
                <input
                  type="text"
                  value={osEtcText}
                  onChange={(e) => setOsEtcText(e.target.value)}
                  disabled={!osEtc}
                  className="border px-2 py-1 text-sm w-32 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* DBMS */}
            <div className="flex items-center border p-2">
              <div className="w-24 font-semibold text-sm">DBMS</div>
              <div className="flex-1 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dbOracle}
                    onChange={(e) => setDbOracle(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">ORACLE</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dbMssql}
                    onChange={(e) => setDbMssql(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">MS-SQL</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dbDb2}
                    onChange={(e) => setDbDb2(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">DB2</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dbSybase}
                    onChange={(e) => setDbSybase(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Sybase</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dbInformix}
                    onChange={(e) => setDbInformix(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Informix</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dbEtc}
                    onChange={(e) => setDbEtc(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Í∏∞Ì?</span>
                </label>
                <input
                  type="text"
                  value={dbEtcText}
                  onChange={(e) => setDbEtcText(e.target.value)}
                  disabled={!dbEtc}
                  className="border px-2 py-1 text-sm w-32 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* ?ÑÎ†à?ÑÏõç */}
            <div className="flex items-center border p-2">
              <div className="w-24 font-semibold text-sm">?ÑÎ†à?ÑÏõç</div>
              <div className="flex-1 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={frameCorebase}
                    onChange={(e) => setFrameCorebase(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Corebase</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={frameProFrame}
                    onChange={(e) => setFrameProFrame(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">ProFrame</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={frameAnyFrame}
                    onChange={(e) => setFrameAnyFrame(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">AnyFrame</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={frameDigital}
                    onChange={(e) => setFrameDigital(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">?ÑÏûê?ïÎ?</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={frameEtc}
                    onChange={(e) => setFrameEtc(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Í∏∞Ì?</span>
                </label>
                <input
                  type="text"
                  value={frameEtcText}
                  onChange={(e) => setFrameEtcText(e.target.value)}
                  disabled={!frameEtc}
                  className="border px-2 py-1 text-sm w-32 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* WAS/ÎØ∏Îì§?®Ïñ¥ */}
            <div className="flex items-start border p-2">
              <div className="w-24 font-semibold text-sm pt-1">WAS/ÎØ∏Îì§?®Ïñ¥</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={wasJeus}
                      onChange={(e) => setWasJeus(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">JEUS</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={wasWeblogic}
                      onChange={(e) => setWasWeblogic(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Weblogic</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={wasWebSphere}
                      onChange={(e) => setWasWebSphere(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">WebSphere</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={wasMts}
                      onChange={(e) => setWasMts(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">MTS(COM++)</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={wasTmax}
                      onChange={(e) => setWasTmax(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">T-MAX</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={wasTuxedo}
                      onChange={(e) => setWasTuxedo(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Tuxedo</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={wasEtc}
                    onChange={(e) => setWasEtc(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Í∏∞Ì?</span>
                </label>
                <input
                  type="text"
                  value={wasEtcText}
                  onChange={(e) => setWasEtcText(e.target.value)}
                  disabled={!wasEtc}
                  className="border px-2 py-1 text-sm w-32 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* ?∏Ïñ¥/Í∞úÎ∞ú?òÍ≤Ω */}
            <div className="flex items-start border p-2">
              <div className="w-24 font-semibold text-sm pt-1">?∏Ïñ¥/Í∞úÎ∞ú?òÍ≤Ω</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langJava}
                      onChange={(e) => setLangJava(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">JAVA,JSP</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langEjb}
                      onChange={(e) => setLangEjb(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">EJB</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langAsp}
                      onChange={(e) => setLangAsp(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">.NET,C#,ASP</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langProc}
                      onChange={(e) => setLangProc(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">PRO*C</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langC}
                      onChange={(e) => setLangC(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">C,C++</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langAjax}
                      onChange={(e) => setLangAjax(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Ajax</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langStruts}
                      onChange={(e) => setLangStruts(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Struts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langIBatis}
                      onChange={(e) => setLangIBatis(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">iBatis</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langSpring}
                      onChange={(e) => setLangSpring(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Spring</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langJQuery}
                      onChange={(e) => setLangJQuery(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">JQuery</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langHtml5}
                      onChange={(e) => setLangHtml5(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">HTML5</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langVb}
                      onChange={(e) => setLangVb(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Visual Basic</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langPb}
                      onChange={(e) => setLangPb(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Power Bulder</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langVc}
                      onChange={(e) => setLangVc(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Visual C++</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={langDelphi}
                      onChange={(e) => setLangDelphi(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Delphi</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={langEtc}
                    onChange={(e) => setLangEtc(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Í∏∞Ì?</span>
                </label>
                <input
                  type="text"
                  value={langEtcText}
                  onChange={(e) => setLangEtcText(e.target.value)}
                  disabled={!langEtc}
                  className="border px-2 py-1 text-sm w-32 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* TOOL */}
            <div className="flex items-start border p-2">
              <div className="w-24 font-semibold text-sm pt-1">TOOL</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={toolMiplatform}
                      onChange={(e) => setToolMiplatform(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Miplatform</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={toolXplatform}
                      onChange={(e) => setToolXplatform(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Xplatform</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={toolNcrm}
                      onChange={(e) => setToolNcrm(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">NCRM</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={toolXframe}
                      onChange={(e) => setToolXframe(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">xFrame</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={toolGause}
                      onChange={(e) => setToolGause(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Gause</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={toolRd}
                      onChange={(e) => setToolRd(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">RD(Report Design)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={toolOz}
                      onChange={(e) => setToolOz(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">OZ Report</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={toolCr}
                      onChange={(e) => setToolCr(e.target.checked)}
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                    <span className="text-sm leading-none mt-1">Crystal Report</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={toolEtc}
                    onChange={(e) => setToolEtc(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Í∏∞Ì?</span>
                </label>
                <input
                  type="text"
                  value={toolEtcText}
                  onChange={(e) => setToolEtcText(e.target.value)}
                  disabled={!toolEtc}
                  className="border px-2 py-1 text-sm w-32 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Î™®Î∞î??*/}
            <div className="flex items-center border p-2">
              <div className="w-24 font-semibold text-sm">Î™®Î∞î??/div>
              <div className="flex-1 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={mobileAndroid}
                    onChange={(e) => setMobileAndroid(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Android</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={mobileIos}
                    onChange={(e) => setMobileIos(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">IO/S</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={mobileEtc}
                    onChange={(e) => setMobileEtc(e.target.checked)}
                    className="w-4 h-4 mr-1 flex-shrink-0"
                  />
                  <span className="text-sm leading-none mt-1">Í∏∞Ì?</span>
                </label>
                <input
                  type="text"
                  value={mobileEtcText}
                  onChange={(e) => setMobileEtcText(e.target.value)}
                  disabled={!mobileEtc}
                  className="border px-2 py-1 text-sm w-32 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Í∏∞Ì? */}
            <div className="flex items-center border p-2">
              <div className="w-24 font-semibold text-sm">Í∏∞Ì?</div>
              <div className="flex-1">
                <input
                  type="text"
                  value={etcText}
                  onChange={(e) => setEtcText(e.target.value)}
                  className="border px-2 py-1 text-sm w-full"
                  placeholder="Í∏∞Ì? ?¥Ïö©???ÖÎ†•?òÏÑ∏??
                />
              </div>
            </div>
          </div>
        </div>

        {/* Î≤ÑÌäº */}
        <div className="flex justify-end space-x-2 p-4 border-t">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            ?ïÏù∏
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Ï∑®ÏÜå
          </button>
        </div>
      </div>
    </div>
  );
} 

