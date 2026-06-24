export const navItems = [
  { href: "/", label: "Home" },
  { href: "/penyebab", label: "Penyebab & Pencegahan" },
  { href: "/dampak", label: "Dampak" },
  { href: "/kalkulator", label: "Kalkulator" },
];

export const infoPages = {
  home: {
    title: "Masa Depan Anak Sehat, Indonesia Hebat",
    paragraphs: [
      "Stunting adalah ancaman nyata bagi potensi generasi penerus bangsa. Ini bukan hanya tentang tinggi badan, tetapi tentang perkembangan otak, kecerdasan, dan kesehatan jangka panjang anak. Portal ini hadir untuk memberikan informasi akurat dan alat praktis bagi orang tua dan kader kesehatan untuk bersama-sama mencegah stunting.",
      "Mari kenali penyebabnya, pahami dampaknya, dan terapkan langkah pencegahan yang tepat. Gunakan kalkulator gizi kami untuk memantau tumbuh kembang buah hati Anda secara berkala.",
    ],
    highlights: [
      {
        value: "1.000 HPK",
        label: "Periode paling penting sejak kehamilan sampai anak berusia 2 tahun.",
      },
      {
        value: "Rutin",
        label: "Pemantauan berat, tinggi, dan status gizi perlu dilakukan setiap sesi Posyandu.",
      },
      {
        value: "Terpadu",
        label: "Keluarga, kader, Posyandu, dan pemerintah desa perlu bergerak bersama.",
      },
    ],
    sections: [
      {
        title: "Informasi Penting untuk Kader dan Orang Tua",
        eyebrow: "Prioritas Layanan",
        tone: "teal",
        points: [
          {
            title: "Catat Data Anak dengan Konsisten",
            description:
              "Gunakan nama, NIK, tanggal lahir, berat, dan tinggi yang benar agar histori pertumbuhan dapat dibaca dari waktu ke waktu.",
          },
          {
            title: "Perhatikan Tren, Bukan Sekali Ukur",
            description:
              "Satu hasil pengukuran perlu dilihat bersama riwayat sebelumnya. Penurunan tren berat atau tinggi perlu segera ditindaklanjuti.",
          },
          {
            title: "Rujuk Jika Ada Tanda Risiko",
            description:
              "Jika hasil menunjukkan risiko gizi atau indikasi stunting, arahkan keluarga untuk konsultasi ke tenaga kesehatan.",
          },
          {
            title: "Edukasi Gizi Praktis",
            description:
              "Dorong konsumsi protein hewani, ASI eksklusif, MPASI bergizi, imunisasi, sanitasi, dan perilaku hidup bersih.",
          },
        ],
      },
    ],
    villageGovernment: {
      title: "Struktur Pemerintahan Desa Girimulyo",
      subtitle: "Kecamatan Marga Sekampung, Kabupaten Lampung Timur",
      root: {
        title: "Desa Girimulyo",
        description: "Akar koordinasi layanan masyarakat dan dukungan Posyandu.",
      },
      groups: [
        {
          title: "Pimpinan Utama",
          layout: "leaders",
          members: [
            { position: "Kepala Desa", name: "Echwanudin", photo: "" },
            { position: "Sekretaris Desa", name: "Sanyoto Hermawan, S.Ap", photo: "" },
          ],
        },
        {
          title: "Kepala Seksi (Kasi)",
          layout: "division",
          members: [
            { position: "Kasi Pemerintahan", name: "Kristiana Putra", photo: "" },
            {
              position: "Kasi Kesejahteraan",
              name: "Widada",
              note: "Penanggung jawab alur koordinasi kesehatan & Posyandu",
              photo: "",
            },
            { position: "Kasi Pelayanan", name: "Juridno", photo: "" },
          ],
        },
        {
          title: "Kepala Urusan (Kaur)",
          layout: "division",
          members: [
            { position: "Kaur Tata Usaha & Umum", name: "Tri Hartono", photo: "" },
            { position: "Kaur Perencanaan", name: "Edy Sukarno", photo: "" },
            { position: "Kaur Keuangan", name: "Muksin", photo: "" },
          ],
        },
        {
          title: "Tim Teknis & Administrasi (Operator Desa)",
          layout: "operators",
          members: [
            { name: "Dieky Mahindra", photo: "" },
            { name: "Intan Agustin Lies Saputri", photo: "" },
          ],
        },
        {
          title: "Kepala Dusun (Kadus) / Penguasa Wilayah Posyandu",
          layout: "territory",
          members: [
            { name: "Eko Supriyadi", photo: "" },
            { name: "Abdul Jahidin", photo: "" },
            { name: "Fujar", photo: "" },
            { name: "Jiyanto", photo: "" },
            { name: "Marjaka", photo: "" },
            { name: "Ngatimin", photo: "" },
            { name: "Nuryadi", photo: "" },
            { name: "Rusnan", photo: "" },
            { name: "Saepudin", photo: "" },
          ],
        },
      ],
    },
  },
  penyebab: {
    title: "Penyebab dan Pencegahan Stunting",
    paragraphs: [
      "Stunting tidak terjadi secara tiba-tiba, melainkan akibat dari berbagai faktor yang saling terkait, terutama pada 1.000 Hari Pertama Kehidupan (HPK). Memahami akar masalahnya membantu keluarga, kader, dan pemerintah desa menentukan langkah pencegahan yang lebih tepat.",
    ],
    sections: [
      {
        title: "Penyebab Utama Stunting",
        eyebrow: "Akar Masalah",
        tone: "blue",
        points: [
          {
            title: "Kekurangan Gizi Kronis",
            description:
              "Asupan gizi yang tidak memadai dalam waktu lama, baik pada ibu selama kehamilan maupun pada anak setelah lahir, dapat menghambat pertumbuhan.",
          },
          {
            title: "Pola Asuh Kurang Tepat",
            description:
              "Kurangnya pengetahuan tentang ASI eksklusif, MPASI bergizi, dan pola makan anak dapat membuat kebutuhan gizi tidak terpenuhi.",
          },
          {
            title: "Infeksi Berulang",
            description:
              "Diare, infeksi pernapasan, dan penyakit berulang dapat mengurangi nafsu makan serta menghambat penyerapan nutrisi.",
          },
          {
            title: "Sanitasi dan Higiene Buruk",
            description:
              "Akses air bersih dan sanitasi yang terbatas meningkatkan risiko penyakit, sehingga status gizi anak semakin mudah terganggu.",
          },
        ],
      },
      {
        title: "Langkah Pencegahan yang Disarankan",
        eyebrow: "Pencegahan",
        tone: "teal",
        points: [
          {
            title: "Penuhi Gizi Ibu dan Anak",
            description:
              "Pastikan ibu hamil memperoleh gizi seimbang, tablet tambah darah sesuai arahan tenaga kesehatan, serta pemantauan kehamilan rutin.",
          },
          {
            title: "ASI Eksklusif dan MPASI Bergizi",
            description:
              "Berikan ASI eksklusif selama 6 bulan, lalu lanjutkan MPASI yang kaya protein hewani, energi, dan mikronutrien.",
          },
          {
            title: "Pantau Pertumbuhan Berkala",
            description:
              "Datang ke Posyandu untuk mengukur berat dan tinggi anak, mencatat hasil, serta membaca tren pertumbuhan dari waktu ke waktu.",
          },
          {
            title: "Jaga Sanitasi dan Imunisasi",
            description:
              "Biasakan cuci tangan, gunakan air bersih, lengkapi imunisasi, dan segera konsultasi jika anak sering sakit atau sulit makan.",
          },
        ],
      },
    ],
  },
  dampak: {
    title: "Konsekuensi Serius dari Stunting",
    paragraphs: [
      "Stunting bukanlah sekadar masalah fisik (tubuh pendek), tetapi membawa dampak merugikan yang bersifat permanen hingga dewasa.",
    ],
    points: [
      {
        title: "Gangguan Perkembangan Kognitif",
        description:
          "Perkembangan otak anak terganggu secara permanen, yang mengakibatkan penurunan kemampuan belajar, memori, dan konsentrasi. Ini berdampak langsung pada prestasi akademik anak.",
      },
      {
        title: "Melemahnya Sistem Kekebalan Tubuh",
        description:
          "Anak stunting lebih sering sakit karena daya tahan tubuhnya tidak optimal. Mereka lebih rentan terhadap infeksi, yang semakin memperburuk status gizi mereka.",
      },
      {
        title: "Peningkatan Risiko Penyakit Kronis",
        description:
          "Saat dewasa, anak yang mengalami stunting lebih berisiko menderita penyakit tidak menular seperti obesitas, diabetes tipe 2, penyakit jantung, dan stroke.",
      },
      {
        title: "Menurunnya Produktivitas Ekonomi",
        description:
          "Akibat kemampuan kognitif yang terbatas, individu yang stunting saat kecil cenderung memiliki produktivitas kerja dan pendapatan yang lebih rendah saat dewasa.",
      },
    ],
  },
  pencegahan: {
    title: "Kunci Pencegahan Stunting",
    paragraphs: [
      "Pencegahan stunting paling efektif jika dilakukan sedini mungkin, dengan fokus pada 1.000 Hari Pertama Kehidupan (HPK).",
    ],
    points: [
      {
        title: "Intervensi Gizi Spesifik",
        description:
          "Ini adalah intervensi yang berhubungan langsung dengan asupan gizi, meliputi pemenuhan gizi seimbang bagi ibu hamil, pemberian ASI eksklusif selama 6 bulan, dilanjutkan dengan MPASI yang kaya protein hewani, serta pemantauan pertumbuhan rutin.",
      },
      {
        title: "Intervensi Gizi Sensitif",
        description:
          "Ini adalah intervensi pendukung yang tidak kalah penting, seperti menyediakan akses terhadap air bersih dan sanitasi layak, meningkatkan edukasi tentang pola asuh dan gizi, serta memastikan akses mudah ke layanan kesehatan berkualitas.",
      },
    ],
  },
};
