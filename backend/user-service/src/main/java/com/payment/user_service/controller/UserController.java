package com.payment.user_service.controller;

import com.payment.user_service.model.DTO.UserForm;
import com.payment.user_service.model.User;
import com.payment.user_service.service.JwtService;
import com.payment.user_service.service.UserService;
import feign.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody User user) {
        return service.createUser(user);
    }

    @PostMapping("login")
    public String login(@RequestBody User user) throws Exception {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword()));

        if(authentication.isAuthenticated())
            return jwtService.generateToken(user.getEmail());
        else
            return "Login Failed";
    }

    @PostMapping("create")
    public ResponseEntity<String> createUser(@RequestBody UserForm user) {
        return service.saveUserForm(user);
    }

    @PostMapping("createPin/{email}/{newPinCode}")
    public ResponseEntity<String> createPin(@PathVariable("email") String email, @PathVariable("newPinCode") int newPinCode) {
        return service.createPin(email,newPinCode);
    }

    @GetMapping("getPin/{email}")
    public ResponseEntity<Integer> getPin(@PathVariable("email") String email) {
        return service.fetchPin(email);
    }

    @GetMapping("validatePin/{email}/{payPin}")
    public ResponseEntity<Boolean> validatePin(@PathVariable("email") String email,@PathVariable("payPin") String payPin) {
        return service.validatePin(email,Integer.parseInt(payPin));
    }

    @GetMapping("getUpiId/{email}")
    public ResponseEntity<String> getUpiId(@PathVariable("email") String email) {
        return service.fetchUPI(email);
    }

    @GetMapping("fetchBalance/{email}")
    public ResponseEntity<Double> fetchBalance(@PathVariable("email") String email) {
        return service.fetchBalance(email);
    }

    @GetMapping("validate/{upiId}")
    public ResponseEntity<Boolean> getValidation(@PathVariable("upiId") String upiId) {
        return service.getValidation(upiId);
    }

    @GetMapping("getUpiByPhone/{phone}")
    public ResponseEntity<String> getUpiIdFromPhone(@PathVariable("phone") String phone) {
        return service.getUpiIdfromPhone(phone);
    }

    @GetMapping("validatePhone/{phone}")
    public ResponseEntity<Boolean> validatePhone(@PathVariable("phone") String phone) {
        return service.validatePhone(Long.parseLong(phone));
    }
}
