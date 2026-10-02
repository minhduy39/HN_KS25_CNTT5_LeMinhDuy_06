let currentEnrollCode = "";
let isEnrollValid = false;
let totalRevenue = 0;
let totalEnrollments = 0;
let isRunning = true;

const menuText = `
HỆ THỐNG TUYỂN SINH BRIGHTWAY ENGLISH
1. Nhập và kiểm chuẩn mã đăng ký
2. Tính học phí khóa học
3. Thẩm định số báo danh may mắn
0. Thoát chương trình

Vui lòng nhập lựa chọn của bạn (0 - 3):
`;

function formatMoney(value) {
  return Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: 0
  }) + " VNĐ";
}

function inputPositiveInteger(label, errorMessage) {
  while (true) {
    const input = prompt(label);

    if (input === null) {
      console.log("Hủy giao dịch, quay về menu.");
      return null;
    }

    const value = input.trim();

    if (!/^\d+$/.test(value) || Number(value) <= 0) {
      console.log(errorMessage);
      continue;
    }

    return Number(value);
  }
}

function validateEnroll() {
  currentEnrollCode = "";
  isEnrollValid = false;

  const rawInput = prompt("Nhập mã đăng ký:");
  if (rawInput === null) {
    console.log("Lỗi: Chưa nhập mã đăng ký");
    return;
  }

  const EnrollCode = rawInput.trim().toUpperCase();

  if (EnrollCode === "") {
    console.log("Lỗi: Chưa nhập mã đăng ký");
    return;
  }

  if (EnrollCode.length < 6) {
    console.log("Lỗi: Độ dài nhỏ hơn 6 ký tự");
    return;
  }

  if (!EnrollCode.startsWith("ENG-")) {
    console.log('Lỗi: Sai tiền tố "ENG-"');
    return;
  }

  if (/\s/.test(EnrollCode)) {
    console.log("Lỗi: Chứa khoảng trắng ở giữa");
    return;
  }

  currentEnrollCode = EnrollCode;
  isEnrollValid = true;
  console.log(`Mã phiếu "${currentEnrollCode}" hợp lệ.`);
}

function calcTestFee() {
  if (!isEnrollValid) {
    console.log("Từ chối: Chưa có mã đăng ký hợp lệ. Chọn chức năng 1 trước.");
    return;
  }

  const courseCount = inputPositiveInteger(
    "Nhập số khóa học"
  );

  if (courseCount === null) {
    return;
  }

  const pricePerCourse = inputPositiveInteger(
    "Nhập học phí mối khóa học"
  );

  if (pricePerCourse === null) {
    return;
  }

  const enrollForInvoice = currentEnrollCode;

  const baseCost = courseCount * pricePerCourse;
  const discount = courseCount >= 4 ? Math.round(baseCost * 0.1) : 0;
  const materialFee = Math.round((baseCost - discount) * 0.08);
  const totalPayment = (baseCost - discount) + materialFee;

  totalRevenue += totalPayment;
  totalEnrollments += 1;

  currentEnrollCode = "";
  isEnrollValid = false;

  console.log("=====================================================");
  console.log("                  HÓA ĐƠN KHÓA HỌC");
  console.log("=====================================================");
  console.log(`Mã đăng ký: ${enrollForInvoice}`);
  console.log(`Đơn giá: ${formatMoney(pricePerCourse)}`);
  console.log(`Chi phí cơ sở: ${formatMoney(baseCost)}`);
  console.log(`Tiền giảm giá: ${formatMoney(discount)}`);
  console.log(`Tổng thanh toán: ${formatMoney(totalPayment)}`);
  console.log("=====================================================");
}

function validateLuckyCard() {
  const rawSerial = prompt("Nhập chuỗi số báo danh của học viên: ");
  if (rawSerial === null) {
    console.log("Lỗi: Mã số báo danh không hợp lệ.");
    return;
  }

  const serial = rawSerial.trim();

  if (serial === "" || !/^\d+$/.test(serial) || serial.length < 2 || /^0+$/.test(serial)) {
    console.log("Lỗi: Mã số báo danh không hợp lệ.");
    return;
  }

  const reversedSerial = serial.split("").reverse().join("");
  const isPalindrome = reversedSerial === serial;

  let digitSum = 0;
  for (const digit of serial) {
    digitSum += Number(digit);
  }

  const divisibleBy9 = digitSum % 9 === 0;

  let prize = "Không trúng thưởng";
  if (isPalindrome && divisibleBy9) {
    prize = "Giải Đặc biệt (Học bổng một khóa học trị giá 3.000.000 VNĐ";
  } else if (isPalindrome) {
    prize = "Giải Nhất (Bộ giáo trình luyện thi trị giá 350.000 VNĐ)";
  } else if (divisibleBy9) {
    prize = "Giải Nhì (Voucher giảm 100.000 VNĐ học phí khóa kế tiếp)";
  }

  console.log("=====================================================");
  console.log("             KẾT QUẢ THẨM ĐỊNH SỐ BÁO DANH");
  console.log("=====================================================");
  console.log(`Mã số gốc: ${serial}`);
  console.log(`Mã đảo ngược: ${reversedSerial}`);
  console.log(`Tổng chữ số: ${digitSum}`);
  console.log(`Chia hết cho 9: ${divisibleBy9 ? "Có" : "Không"}`);
  console.log(`Giải thưởng: ${prize}`);
  console.log("=====================================================");
}

function reportShift() {
  console.log("=".repeat(50));
  console.log("BÁO CÁO TỔNG KẾT CA TRỰC");
  console.log("=".repeat(50));

  if (totalEnrollments === 0) {
    console.log("Chưa phát sinh lượt khám nào trong ca");
  } else {
    const averageRevenue = Math.round(totalRevenue / totalEnrollments);
    console.log(`Tổng số lượt khám đã quyết toán: ${totalEnrollments}`);
    console.log(`Tổng doanh thu ca: ${formatMoney(totalRevenue)}`);
    console.log(`Doanh thu trung bình mỗi lượt khám: ${formatMoney(averageRevenue)}`);
  }

  console.log("=".repeat(50));
}

while (isRunning) {
  console.log(menuText);

  const choice = +prompt("Vui lòng nhập lựa chọn của bạn (0 - 3):");

  if (choice === null) {
    console.log("Lỗi: Lựa chọn không hợp lệ.");
    continue;
  }

  switch (choice) {
    case 1:
      validateEnroll();
      break;

    case 2:
      calcTestFee();
      break;

    case 3:
      validateLuckyCard();
      break;

    case 0:
      console.log("Cảm ơn bạn đã sử dụng hệ thống. Tạm biệt!");
      reportShift();
      isRunning = false;
      break;

    default:
      console.log("Lỗi: Lựa chọn không hợp lệ.");
  }
}
