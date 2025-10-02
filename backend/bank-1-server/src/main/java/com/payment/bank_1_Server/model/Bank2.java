package com.payment.bank_1_Server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Bank2 {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long accountId;

    private final String bankName = "Bank2";

    private String customerName;

    private String customerAddress;
    @Column(unique = true)
    private String customerUpiId;
    @Column(unique = true)
    private long customerPhone;
    private int customerPin;
    private long customerBalance;

    @Column(unique = true)
    private long customerAccountNo;
    private String customerIfsc;

    public String getBankName() {
        return bankName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

   public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getCustomerUpiId() {
        return customerUpiId;
    }

    public void setCustomerUpiId(String customerUpiId) {
        this.customerUpiId = customerUpiId;
    }

    public long getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(long customerPhone) {
        this.customerPhone = customerPhone;
    }

    public int getCustomerPin() {
        return customerPin;
    }

    public void setCustomerPin(int customerPin) {
        this.customerPin = customerPin;
    }

    public long getCustomerBalance() {
        return customerBalance;
    }

    public void setCustomerBalance(long customerBalance) {
        this.customerBalance = customerBalance;
    }

    public long getCustomerAccountNo() {
        return customerAccountNo;
    }

    public void setCustomerAccountNo(long customerAccountNo) {
        this.customerAccountNo = customerAccountNo;
    }

    public String getCustomerIfsc() {
        return customerIfsc;
    }

    public void setCustomerIfsc(String customerIfsc) {
        this.customerIfsc = customerIfsc;
    }
}
