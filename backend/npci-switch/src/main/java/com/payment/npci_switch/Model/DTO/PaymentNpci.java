package com.payment.npci_switch.Model.DTO;

public class PaymentNpci {
    private String requestId;
    private String fromVpa;
    private String toVpa;
    private double amount;
    private String status;

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
