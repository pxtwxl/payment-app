package com.payment.bank_1_Server.controller;

import com.payment.bank_1_Server.model.User;
import com.payment.bank_1_Server.service.Bank1Service;
import com.payment.bank_1_Server.service.Bank2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(name = "bank2")
public class Bank2Controller {

    @Autowired
    private Bank2Service service;

    @PostMapping("saveAccount")
    public ResponseEntity<String> saveAccount(@RequestBody User user) {
        return service.saveUserAccount(user);
    }

}
