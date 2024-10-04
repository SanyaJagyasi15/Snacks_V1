package com.snack.backend_v1.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.snack.backend_v1.model.Receipt;
import com.snack.backend_v1.repository.ReceiptRepository;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    private static final Logger logger = LoggerFactory.getLogger(ReceiptService.class);

    public List<Receipt> getAllReceipts() {
        return receiptRepository.findAll();
    }

    public Optional<Receipt> getReceiptById(Long id) {
        return receiptRepository.findById(id);
    }

    @Transactional
    public Receipt createReceipt(Receipt receipt) {
        return receiptRepository.save(receipt);
    }

    @Transactional
    public Receipt updateReceipt(Long id, Receipt receiptDetails) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        receipt.setItems(receiptDetails.getItems());
        receipt.setOrderedFrom(receiptDetails.getOrderedFrom());
        receipt.setReason(receiptDetails.getReason());
        receipt.setDate(receiptDetails.getDate());
        receipt.setAmount(receiptDetails.getAmount());
        receipt.setAttachmentUrl(receiptDetails.getAttachmentUrl());

        return receiptRepository.save(receipt);
    }

    @Transactional
    public void deleteReceipt(Long id) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));
        receiptRepository.delete(receipt);
    }

    public String saveAttachment(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(System.getProperty("user.dir"), "backend-v1", "uploads").toAbsolutePath().normalize();

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("File saved to: " + filePath.toString());

        return fileName;
    }

    public double getTotalAmountForPreviousMonth() {
        LocalDate now = LocalDate.now();
        LocalDate firstDayOfPreviousMonth = now.minusMonths(1).withDayOfMonth(1);
        LocalDate firstDayOfCurrentMonth = now.withDayOfMonth(1);

        logger.info("Calculating total amount for previous month: {} to {}", firstDayOfPreviousMonth, firstDayOfCurrentMonth.minusDays(1));

        double total = receiptRepository.findByDateBetween(firstDayOfPreviousMonth, firstDayOfCurrentMonth.minusDays(1))
                .stream()
                .mapToDouble(Receipt::getAmount)
                .sum();

        logger.info("Total amount calculated: {}", total);
        return total;
    }
}
