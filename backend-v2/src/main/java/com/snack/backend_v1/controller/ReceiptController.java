package com.snack.backend_v1.controller;

import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.snack.backend_v1.model.Receipt;
import com.snack.backend_v1.service.ReceiptService;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @GetMapping
    public List<Receipt> getAllReceipts() {
        return receiptService.getAllReceipts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceiptById(@PathVariable Long id) {
        return receiptService.getReceiptById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Receipt> createReceipt(
            @RequestParam("date") String date,
            @RequestParam("items") String items,
            @RequestParam(value = "orderedFrom", required = false) String orderedFrom,
            @RequestParam("reason") String reason,
            @RequestParam("amount") Double amount,
            @RequestParam("orderedBy") String orderedBy,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        List<String> itemList = Arrays.asList(items.split(","));
        LocalDate parsedDate = LocalDate.parse(date);

        Receipt receipt = new Receipt();
        receipt.setDate(parsedDate);
        receipt.setItems(itemList);
        receipt.setOrderedFrom(orderedFrom != null ? orderedFrom : "");
        receipt.setReason(reason);
        receipt.setAmount(amount);
        receipt.setOrderedBy(orderedBy);

        if (attachment != null && !attachment.isEmpty()) {
            String fileName = receiptService.saveAttachment(attachment);
            String fullPath = Paths.get(System.getProperty("user.dir"), "backend-v1", "uploads", fileName).toString();
            receipt.setAttachmentUrl(fullPath);
        }

        Receipt createdReceipt = receiptService.createReceipt(receipt);
        return ResponseEntity.ok(createdReceipt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receipt> updateReceipt(@PathVariable Long id, @RequestBody Receipt receiptDetails) {
        try {
            Receipt updatedReceipt = receiptService.updateReceipt(id, receiptDetails);
            return ResponseEntity.ok(updatedReceipt);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        try {
            receiptService.deleteReceipt(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
