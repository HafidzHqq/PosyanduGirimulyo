"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { calculateNutritionResult, statusExplanations } from "@/lib/gizi";

const initialForm = {
  nikAnak: "",
  namaAnak: "",
  nikIbu: "",
  namaIbu: "",
  jenisKelamin: "",
  tanggalLahir: "",
  berat: "",
  tinggi: "",
};

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

const resultCards = [
  { key: "wfa", title: "BB/U" },
  { key: "hfa", title: "TB/U" },
  { key: "wfh", title: "BB/TB" },
  { key: "bmifa", title: "IMT/U" },
];

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-sans text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/15";
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
const buttonBase =
  "my-2 mr-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-0 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/20 sm:px-7 sm:py-3.5 sm:text-base";
const tableCellClass = "border-b border-slate-200 px-3 py-3 text-left";

const statusStyles = {
  normal: "bg-primaryLight/50 text-primaryDark",
  warning: "bg-muted text-accent",
  danger: "bg-red-100 text-red-800",
};

function getStatusClass(result) {
  return statusStyles[result.level] || "bg-neutral-100 text-neutral-700";
}

function Notification({ notification }) {
  if (!notification) return null;

  const colorClass =
    notification.type === "success"
      ? "border-health bg-green-50 text-green-900"
      : "border-red-500 bg-red-50 text-red-900";

  return <div className={`mb-5 rounded-lg border-l-4 px-5 py-4 font-medium ${colorClass}`}>{notification.message}</div>;
}

function StatusBadge({ result }) {
  return (
    <div className={`inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold ${getStatusClass(result)}`}>
      {result.text}
      <span className="group relative ml-2 inline-block cursor-pointer">
        <i className="fa-solid fa-circle-info text-secondary" aria-hidden="true" />
        <span className="invisible absolute bottom-[130%] left-1/2 z-10 w-56 -translate-x-1/2 rounded-md bg-slate-700 px-3 py-2 text-left text-xs font-medium leading-5 text-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
          {statusExplanations[result.text] || ""}
        </span>
      </span>
    </div>
  );
}

function makeExcelRows(result) {
  return [
    [
      "NIK Anak",
      "Tanggal Sesi",
      "Nama Anak",
      "NIK Ibu",
      "Nama Ibu",
      "Jenis Kelamin",
      "Tanggal Lahir",
      "Usia",
      "Usia (bulan)",
      "Berat (kg)",
      "Tinggi (cm)",
      "IMT",
      "Kesimpulan Stunting",
      "BB/U (Z)",
      "Status BB/U",
      "TB/U (Z)",
      "Status TB/U",
      "BB/TB (Z)",
      "Status BB/TB",
      "IMT/U (Z)",
      "Status IMT/U",
    ],
    [
      result.nikAnak,
      result.sessionDate,
      result.namaAnak,
      result.nikIbu,
      result.namaIbu,
      result.jenisKelamin,
      result.tanggalLahir,
      result.ageFormatted,
      result.ageMonths,
      result.berat,
      result.tinggi,
      result.imt,
      result.stuntingConclusion,
      result.wfa.z,
      result.wfa.text,
      result.hfa.z,
      result.hfa.text,
      result.wfh.z,
      result.wfh.text,
      result.bmifa.z,
      result.bmifa.text,
    ],
  ];
}

function writeWorkbook(rows, sheetName, filename) {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}

function validateFormData(formData) {
  const hasNumber = /\d/;
  const nikPattern = /^\d{16}$/;

  if (!formData.namaAnak || !formData.nikIbu || !formData.jenisKelamin || !formData.tanggalLahir || !formData.berat || !formData.tinggi) {
    return "Mohon lengkapi semua field yang wajib diisi.";
  }

  if (hasNumber.test(formData.namaAnak)) {
    return "Nama anak tidak boleh berisi angka.";
  }

  if (formData.namaIbu && hasNumber.test(formData.namaIbu)) {
    return "Nama ibu tidak boleh berisi angka.";
  }

  if (formData.nikAnak && !nikPattern.test(formData.nikAnak)) {
    return "NIK anak harus berisi angka saja dan tepat 16 digit.";
  }

  if (!nikPattern.test(formData.nikIbu)) {
    return "NIK ibu wajib berisi angka saja dan tepat 16 digit.";
  }

  return "";
}

export default function NutritionCalculator() {
  const [formData, setFormData] = useState(initialForm);
  const [selectedSessionDate, setSelectedSessionDate] = useState(getTodayDate);
  const [historyScope, setHistoryScope] = useState("session");
  const [lastResult, setLastResult] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSavingHistory, setIsSavingHistory] = useState(false);

  useEffect(() => {
    if (!notification) return undefined;
    const timer = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const isStunted = useMemo(() => {
    if (!lastResult) return false;
    return Number(lastResult.hfa.z) < -2;
  }, [lastResult]);

  function showNotification(message, type) {
    setNotification({ message, type });
  }

  const getHistoryUrl = useCallback((scope = historyScope, sessionDate = selectedSessionDate) => {
    if (scope === "all") {
      return "/api/nutrition-history?scope=all";
    }

    return `/api/nutrition-history?sessionDate=${encodeURIComponent(sessionDate)}`;
  }, [historyScope, selectedSessionDate]);

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);

    try {
      const response = await fetch(getHistoryUrl(historyScope, selectedSessionDate));
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Gagal mengambil histori kalkulator.");
      }

      setReportData(payload.data || []);
      setHasLoadedHistory(true);
    } catch (error) {
      setNotification({ message: error.message, type: "error" });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [getHistoryUrl, historyScope, selectedSessionDate]);

  async function toggleHistory() {
    const nextVisible = !isHistoryVisible;
    setIsHistoryVisible(nextVisible);

    if (nextVisible && !hasLoadedHistory) {
      await loadHistory();
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setFormData(initialForm);
  }

  async function changeSessionDate(event) {
    const nextSessionDate = event.target.value;
    setSelectedSessionDate(nextSessionDate);

    if (historyScope === "session") {
      setReportData([]);
      setHasLoadedHistory(false);
    }

    if (isHistoryVisible && historyScope === "session") {
      setIsLoadingHistory(true);
      try {
        const response = await fetch(getHistoryUrl("session", nextSessionDate));
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Gagal mengambil histori kalkulator.");
        }

        setReportData(payload.data || []);
        setHasLoadedHistory(true);
      } catch (error) {
        setNotification({ message: error.message, type: "error" });
      } finally {
        setIsLoadingHistory(false);
      }
    }
  }

  async function changeHistoryScope(nextScope) {
    if (nextScope === historyScope) return;

    setHistoryScope(nextScope);
    setReportData([]);
    setHasLoadedHistory(false);

    if (isHistoryVisible) {
      setIsLoadingHistory(true);
      try {
        const response = await fetch(getHistoryUrl(nextScope, selectedSessionDate));
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Gagal mengambil histori kalkulator.");
        }

        setReportData(payload.data || []);
        setHasLoadedHistory(true);
      } catch (error) {
        setNotification({ message: error.message, type: "error" });
      } finally {
        setIsLoadingHistory(false);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateFormData(formData);
    if (validationMessage) {
      showNotification(validationMessage, "error");
      return;
    }

    const result = calculateNutritionResult({
      ...formData,
      sessionDate: selectedSessionDate,
      berat: Number(formData.berat),
      tinggi: Number(formData.tinggi),
    });

    setLastResult(result);
    showNotification("Analisis status gizi berhasil!", "success");
  }

  async function addToReport() {
    if (!lastResult) {
      showNotification("Tidak ada data hasil untuk ditambahkan.", "error");
      return;
    }

    setIsSavingHistory(true);

    try {
      const response = await fetch("/api/nutrition-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastResult),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Gagal menyimpan histori ke database.");
      }

      const shouldAppendToCurrentHistory =
        historyScope === "all" || (historyScope === "session" && payload.data.sessionDate === selectedSessionDate);
      const nextReportData = shouldAppendToCurrentHistory ? [payload.data, ...reportData] : reportData;

      if (shouldAppendToCurrentHistory) {
        setReportData(nextReportData);
        setHasLoadedHistory(true);
      }

      setLastResult(null);
      resetForm();
      showNotification("Data berhasil disimpan ke database.", "success");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsSavingHistory(false);
    }
  }

  async function clearReport() {
    if (historyScope === "all") {
      showNotification("Mode semua histori hanya untuk melihat dan mengunduh. Pilih sesi tanggal tertentu untuk menghapus data.", "error");
      return;
    }

    if (reportData.length === 0) {
      showNotification("Laporan sudah kosong.", "error");
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus semua histori sesi ${selectedSessionDate}? Aksi ini tidak dapat dibatalkan.`)) {
      try {
        const response = await fetch(`/api/nutrition-history?sessionDate=${encodeURIComponent(selectedSessionDate)}`, { method: "DELETE" });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Gagal menghapus histori dari database.");
        }

        setReportData([]);
        showNotification("Semua data histori telah berhasil dihapus dari database.", "success");
      } catch (error) {
        showNotification(error.message, "error");
      }
    }
  }

  function saveSingleResult() {
    if (!lastResult) {
      showNotification("Tidak ada data hasil untuk disimpan.", "error");
      return;
    }

    writeWorkbook(
      makeExcelRows(lastResult),
      "Hasil Analisis",
      `Hasil_Gizi_${lastResult.namaAnak}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    showNotification("File Excel berhasil disimpan!", "success");
  }

  function downloadReport() {
    if (reportData.length === 0) {
      showNotification("Belum ada data untuk diunduh.", "error");
      return;
    }

    const headers = [
      "No",
      "Tanggal Sesi",
      "NIK Anak",
      "Nama Anak",
      "NIK Ibu",
      "Nama Ibu",
      "Jenis Kelamin",
      "Tanggal Lahir",
      "Usia",
      "Usia (bulan)",
      "Berat (kg)",
      "Tinggi (cm)",
      "IMT",
      "Kesimpulan Stunting",
      "BB/U (Z)",
      "Status BB/U",
      "TB/U (Z)",
      "Status TB/U",
      "BB/TB (Z)",
      "Status BB/TB",
      "IMT/U (Z)",
      "Status IMT/U",
    ];
    const rows = reportData.map((data, index) => [
      index + 1,
      data.sessionDate,
      data.nikAnak,
      data.namaAnak,
      data.nikIbu,
      data.namaIbu,
      data.jenisKelamin,
      data.tanggalLahir,
      data.ageFormatted,
      data.ageMonths,
      data.berat,
      data.tinggi,
      data.imt,
      data.stuntingConclusion,
      data.wfa.z,
      data.wfa.text,
      data.hfa.z,
      data.hfa.text,
      data.wfh.z,
      data.wfh.text,
      data.bmifa.z,
      data.bmifa.text,
    ]);

    writeWorkbook(
      [headers, ...rows],
      "Laporan Gizi",
      historyScope === "all" ? `Laporan_Gizi_Semua_Histori_${getTodayDate()}.xlsx` : `Laporan_Gizi_Sesi_${selectedSessionDate}.xlsx`,
    );
    showNotification("Laporan berhasil diunduh!", "success");
  }

  return (
    <main className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft sm:mt-7">
      <section className="border-b border-slate-200 bg-slate-50 px-4 py-6 sm:px-7 sm:py-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Kalkulator Posyandu</p>
        <h2 className="max-w-3xl text-2xl font-bold leading-tight text-ink sm:text-4xl">
          Kalkulator Status Gizi Anak
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Masukkan data anak, hitung status gizi, lalu simpan hasil ke database atau unduh laporan Excel.
        </p>
      </section>

      <section className="px-4 py-5 sm:px-7 sm:py-7">

      <Notification notification={notification} />

      <form className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5" noValidate onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className={labelClass} htmlFor="sessionDate">Tanggal Sesi Posyandu</label>
          <input
            className={fieldClass}
            id="sessionDate"
            type="date"
            value={selectedSessionDate}
            onChange={changeSessionDate}
          />
        </div>

        <div className="mb-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="nikAnak">NIK Anak (Opsional)</label>
            <input
              className={fieldClass}
              id="nikAnak"
              inputMode="numeric"
              maxLength="16"
              name="nikAnak"
              pattern="[0-9]{16}"
              placeholder="16 digit angka"
              type="text"
              value={formData.nikAnak}
              onChange={updateField}
            />

            <label className={`${labelClass} mt-5`} htmlFor="namaAnak">Nama Anak</label>
            <input className={fieldClass} id="namaAnak" name="namaAnak" placeholder="Nama tanpa angka" type="text" value={formData.namaAnak} onChange={updateField} />
          </div>

          <div>
            <label className={labelClass} htmlFor="nikIbu">NIK Ibu</label>
            <input
              className={fieldClass}
              id="nikIbu"
              inputMode="numeric"
              maxLength="16"
              name="nikIbu"
              pattern="[0-9]{16}"
              placeholder="16 digit angka"
              type="text"
              value={formData.nikIbu}
              onChange={updateField}
            />

            <label className={`${labelClass} mt-5`} htmlFor="namaIbu">Nama Ibu</label>
            <input className={fieldClass} id="namaIbu" name="namaIbu" placeholder="Nama tanpa angka" type="text" value={formData.namaIbu} onChange={updateField} />
          </div>
        </div>

        <div className="mb-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="jenisKelamin">Jenis Kelamin</label>
            <select className={fieldClass} id="jenisKelamin" name="jenisKelamin" value={formData.jenisKelamin} onChange={updateField}>
              <option value="">-- Pilih --</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="tanggalLahir">Tanggal Lahir</label>
            <input className={fieldClass} id="tanggalLahir" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={updateField} />
          </div>
        </div>

        <div className="mb-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="berat">Berat Badan (kg)</label>
            <input className={fieldClass} id="berat" name="berat" step="0.1" type="number" value={formData.berat} onChange={updateField} />
          </div>

          <div>
            <label className={labelClass} htmlFor="tinggi">Tinggi Badan (cm)</label>
            <input className={fieldClass} id="tinggi" name="tinggi" step="0.1" type="number" value={formData.tinggi} onChange={updateField} />
          </div>
        </div>

        <button className={`${buttonBase} bg-primary hover:bg-primaryDark`} type="submit">
          <i className="fa-solid fa-calculator text-lg" aria-hidden="true" />
          Hitung Status Gizi
        </button>
      </form>

      {lastResult && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-card sm:px-5 sm:py-8">
          <div
            className={`mb-5 rounded-2xl border p-4 text-center text-xl font-bold sm:text-2xl ${
              isStunted ? "border-red-200 bg-red-50 text-red-900" : "border-green-200 bg-green-50 text-green-900"
            }`}
          >
            <i className={`fa-solid ${isStunted ? "fa-triangle-exclamation" : "fa-circle-check"}`} aria-hidden="true" />
            {isStunted ? " TERINDIKASI STUNTING" : " TIDAK TERINDIKASI STUNTING"}
          </div>

          <h3 className="mb-5 text-center text-lg font-bold text-ink sm:text-xl">Hasil Analisis untuk {lastResult.namaAnak}</h3>
          <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 sm:p-5">
            <div className="border-b border-dashed border-slate-200 pb-2 text-sm text-slate-600"><strong className="block text-slate-800">Nama Ibu:</strong> {lastResult.namaIbu}</div>
            <div className="border-b border-dashed border-slate-200 pb-2 text-sm text-slate-600"><strong className="block text-slate-800">Usia Anak:</strong> {lastResult.ageFormatted}</div>
            <div className="border-b border-dashed border-slate-200 pb-2 text-sm text-slate-600"><strong className="block text-slate-800">Tinggi Badan:</strong> {lastResult.tinggi} cm</div>
            <div className="border-b border-dashed border-slate-200 pb-2 text-sm text-slate-600"><strong className="block text-slate-800">Berat Badan:</strong> {lastResult.berat} kg</div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {resultCards.map((card) => (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm" key={card.key}>
                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">{card.title}</div>
                <div className="mb-2 text-3xl font-bold text-slate-900">{lastResult[card.key].z} SD</div>
                <StatusBadge result={lastResult[card.key]} />
              </div>
            ))}
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <button className={`${buttonBase} bg-secondary hover:bg-[#2f76bd]`} type="button" onClick={addToReport}>
              <i className="fa-solid fa-plus text-lg" aria-hidden="true" />
              {isSavingHistory ? "Menyimpan..." : "Simpan ke Database"}
            </button>
            <button className={`${buttonBase} bg-health hover:bg-primaryDark`} type="button" onClick={saveSingleResult}>
              <i className="fa-solid fa-file-excel text-lg" aria-hidden="true" />
              Simpan Hasil Ini (Excel)
            </button>
          </div>
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-card sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-slate-900">
              Histori Kalkulator{hasLoadedHistory ? ` (${reportData.length} data)` : ""}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {historyScope === "all"
                ? "Menampilkan seluruh histori kalkulator yang tersimpan di database."
                : `Histori yang tampil dan diunduh hanya untuk sesi tanggal ${selectedSessionDate}.`}
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primaryLight/30 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primaryLight/50 focus:outline-none focus:ring-4 focus:ring-primary/15"
            type="button"
            onClick={toggleHistory}
          >
            <i className={`fa-solid ${isHistoryVisible ? "fa-eye-slash" : "fa-clock-rotate-left"}`} aria-hidden="true" />
            {isHistoryVisible ? "Sembunyikan Histori" : "Lihat Histori"}
          </button>
        </div>

        {isHistoryVisible && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex w-full rounded-xl bg-white p-1 shadow-sm sm:w-auto">
                <button
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition sm:flex-none ${
                    historyScope === "session" ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                  }`}
                  type="button"
                  onClick={() => changeHistoryScope("session")}
                >
                  Sesi Ini
                </button>
                <button
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition sm:flex-none ${
                    historyScope === "all" ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                  }`}
                  type="button"
                  onClick={() => changeHistoryScope("all")}
                >
                  Semua Histori
                </button>
              </div>
              <div className="text-sm font-medium text-slate-600">
                {historyScope === "all" ? "Semua tanggal sesi" : `Sesi: ${selectedSessionDate}`}
              </div>
            </div>

            {isLoadingHistory && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-600">
                Memuat histori dari database...
              </div>
            )}

            {!isLoadingHistory && reportData.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                Belum ada histori tersimpan.
              </div>
            )}

            {!isLoadingHistory && reportData.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full overflow-hidden rounded-xl bg-white text-sm shadow">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className={tableCellClass}>No</th>
                        <th className={tableCellClass}>Tanggal Sesi</th>
                        <th className={tableCellClass}>Nama Anak</th>
                        <th className={tableCellClass}>Usia</th>
                        <th className={tableCellClass}>Kesimpulan</th>
                        <th className={tableCellClass}>BB/U (Z)</th>
                        <th className={tableCellClass}>Status</th>
                        <th className={tableCellClass}>TB/U (Z)</th>
                        <th className={tableCellClass}>Status</th>
                        <th className={tableCellClass}>BB/TB (Z)</th>
                        <th className={tableCellClass}>Status</th>
                        <th className={tableCellClass}>IMT/U (Z)</th>
                        <th className={tableCellClass}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((data, index) => (
                        <tr className="hover:bg-slate-50" key={data.id || `${data.namaAnak}-${data.tanggalLahir}-${index}`}>
                          <td className={tableCellClass}>{index + 1}</td>
                          <td className={tableCellClass}>{data.sessionDate || "-"}</td>
                          <td className={tableCellClass}>{data.namaAnak}</td>
                          <td className={tableCellClass}>{data.ageFormatted}</td>
                          <td className={tableCellClass}>{data.stuntingConclusion}</td>
                          <td className={tableCellClass}>{data.wfa.z}</td>
                          <td className={`${tableCellClass} ${getStatusClass(data.wfa)}`}>{data.wfa.text}</td>
                          <td className={tableCellClass}>{data.hfa.z}</td>
                          <td className={`${tableCellClass} ${getStatusClass(data.hfa)}`}>{data.hfa.text}</td>
                          <td className={tableCellClass}>{data.wfh.z}</td>
                          <td className={`${tableCellClass} ${getStatusClass(data.wfh)}`}>{data.wfh.text}</td>
                          <td className={tableCellClass}>{data.bmifa.z}</td>
                          <td className={`${tableCellClass} ${getStatusClass(data.bmifa)}`}>{data.bmifa.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button className={`${buttonBase} bg-health hover:bg-primaryDark`} type="button" onClick={downloadReport}>
                  <i className="fa-solid fa-download text-lg" aria-hidden="true" />
                  {historyScope === "all" ? "Download Semua Histori (Excel)" : "Download Histori Sesi Ini (Excel)"}
                </button>
                {historyScope === "session" && (
                  <button className={`${buttonBase} bg-danger hover:bg-red-700`} type="button" onClick={clearReport}>
                    <i className="fa-solid fa-trash text-lg" aria-hidden="true" />
                    Hapus Histori Sesi Ini
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
      </section>
    </main>
  );
}
