package com.snack.backend_v1.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snack.backend_v1.service.ReceiptService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private ReceiptService receiptService;

    @GetMapping("/monthly-total")
    public double getMonthlyTotal() {
        logger.info("Received request for monthly total notification");
        double total = receiptService.getTotalAmountForPreviousMonth();
        logger.info("Calculated monthly total: {}", total);
        return total;
    }
}
