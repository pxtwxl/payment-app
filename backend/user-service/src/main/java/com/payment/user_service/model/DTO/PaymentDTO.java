package com.payment.user_service.model.DTO;

public class PaymentDTO {
    private String fromVpa;
    private String toVpa;
    private double amount;

    public String getFromVpa() {
        return fromVpa;
    }

    public void setFromVpa(String fromVpa) {
        this.fromVpa = fromVpa;
    }

    public String getToVpa() {
        return toVpa;
    }

    public void setToVpa(String toVpa) {
        this.toVpa = toVpa;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
