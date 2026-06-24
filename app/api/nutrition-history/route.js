import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/lib/auth";
import { ensureNutritionHistoryTable } from "@/lib/nutritionHistoryTable";
import { query } from "@/lib/db";

export const runtime = "nodejs";

function normalizeHistoryRow(row) {
  return {
    ...row.result_json,
    id: row.id,
    sessionDate: row.result_json?.sessionDate || row.session_date,
    createdAt: row.created_at,
  };
}

function buildInsertParams(result) {
  const isStunted = result.isStunted ?? Number(result.hfa?.z) < -2;
  const stuntingConclusion = result.stuntingConclusion || (isStunted ? "TERINDIKASI STUNTING" : "TIDAK TERINDIKASI STUNTING");
  const sessionDate = result.sessionDate || new Date().toISOString().split("T")[0];

  return [
    sessionDate,
    result.nikAnak || null,
    result.namaAnak,
    result.nikIbu || null,
    result.namaIbu || null,
    result.jenisKelamin,
    result.tanggalLahir,
    result.ageFormatted,
    result.ageMonths ?? null,
    result.berat,
    result.tinggi,
    result.imt ?? null,
    isStunted,
    stuntingConclusion,
    result.wfa.z,
    result.wfa.text,
    result.wfa.level,
    result.hfa.z,
    result.hfa.text,
    result.hfa.level,
    result.wfh.z,
    result.wfh.text,
    result.wfh.level,
    result.bmifa.z,
    result.bmifa.text,
    result.bmifa.level,
    JSON.stringify({
      ...result,
      sessionDate,
      isStunted,
      stuntingConclusion,
    }),
  ];
}

function requireAuth() {
  if (!isAuthenticated(cookies())) {
    return NextResponse.json({ error: "Anda harus login untuk mengakses histori kalkulator." }, { status: 401 });
  }

  return null;
}

export async function GET(request) {
  const authError = requireAuth();
  if (authError) return authError;

  try {
    await ensureNutritionHistoryTable();
    const { searchParams } = new URL(request.url);
    const sessionDate = searchParams.get("sessionDate");
    const scope = searchParams.get("scope");
    const { rows } = scope === "all"
      ? await query(`
          SELECT id, session_date, result_json, created_at
          FROM nutrition_histories
          ORDER BY created_at DESC
        `)
      : sessionDate
      ? await query(
          `
            SELECT id, session_date, result_json, created_at
            FROM nutrition_histories
            WHERE session_date = $1
            ORDER BY created_at DESC
          `,
          [sessionDate],
        )
      : await query(`
          SELECT id, session_date, result_json, created_at
          FROM nutrition_histories
          ORDER BY created_at DESC
          LIMIT 100
        `);

    return NextResponse.json({ data: rows.map(normalizeHistoryRow) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = requireAuth();
  if (authError) return authError;

  try {
    const result = await request.json();

    if (!result?.namaAnak || !result?.jenisKelamin || !result?.tanggalLahir || !result?.berat || !result?.tinggi) {
      return NextResponse.json({ error: "Data hasil kalkulator tidak lengkap." }, { status: 400 });
    }

    await ensureNutritionHistoryTable();
    const { rows } = await query(
      `
        INSERT INTO nutrition_histories (
          session_date,
          nik_anak,
          nama_anak,
          nik_ibu,
          nama_ibu,
          jenis_kelamin,
          tanggal_lahir,
          usia,
          usia_bulan,
          berat,
          tinggi,
          imt,
          is_stunted,
          stunting_conclusion,
          wfa_z,
          wfa_status,
          wfa_level,
          hfa_z,
          hfa_status,
          hfa_level,
          wfh_z,
          wfh_status,
          wfh_level,
          bmifa_z,
          bmifa_status,
          bmifa_level,
          result_json
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27::jsonb
        )
        RETURNING id, session_date, result_json, created_at
      `,
      buildInsertParams(result),
    );

    return NextResponse.json({ data: normalizeHistoryRow(rows[0]) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const authError = requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const sessionDate = searchParams.get("sessionDate");

    if (!sessionDate) {
      return NextResponse.json({ error: "Tanggal sesi wajib dipilih untuk menghapus histori." }, { status: 400 });
    }

    await ensureNutritionHistoryTable();
    await query("DELETE FROM nutrition_histories WHERE session_date = $1", [sessionDate]);

    return NextResponse.json({ data: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
