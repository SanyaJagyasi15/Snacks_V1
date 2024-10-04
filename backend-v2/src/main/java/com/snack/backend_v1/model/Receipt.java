package com.snack.backend_v1.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<String> items;

    private String orderedFrom = "";
    private String reason;
    private LocalDate date;
    private Double amount;
    private String attachmentUrl;

    private String orderedBy;

    // Constructors, getters, and setters
    public Receipt() {
    }

    public Receipt(Long id, List<String> items, String orderedFrom, String reason, LocalDate date, Double amount, String attachmentUrl, String orderedBy) {
        this.id = id;
        this.items = items;
        this.orderedFrom = orderedFrom;
        this.reason = reason;
        this.date = date;
        this.amount = amount;
        this.attachmentUrl = attachmentUrl;
        this.orderedBy = orderedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }

    public String getOrderedFrom() {
        return orderedFrom;
    }

    public void setOrderedFrom(String orderedFrom) {
        this.orderedFrom = orderedFrom;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public String getOrderedBy() {
        return orderedBy;
    }

    public void setOrderedBy(String orderedBy) {
        this.orderedBy = orderedBy;
    }

}
