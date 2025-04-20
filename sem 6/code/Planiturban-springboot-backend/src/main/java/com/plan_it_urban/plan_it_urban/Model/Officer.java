package com.plan_it_urban.plan_it_urban.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "officer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "officer_id")
    private Long officer_id;

    @Column(name="password")
    private String password;

    @Column(name = "officer_name")
    private String officer_name;

    @Column(name = "officer_email",unique = true)
    private String officerEmail;

    @Column(name = "officer_dept")
    private String officer_dept;  // Keep department as a simple string since it's static

//    // Fields not taken from user but exist in the database
//    @Temporal(TemporalType.DATE)
//    @Column(name = "officer_registered", insertable = false, updatable = false)
//    private Date officer_registered;

    @Lob
    @Column(name = "upload_attestation_officer_proof", insertable = false, updatable = false)
    private String uploadAttestationOfficerProof;

    @Lob
    @Column(name = "upload_certificate_of_incorporation", insertable = false, updatable = false)
    private String uploadCertificateOfIncorporation;

    @Lob
    @Column(name = "upload_gov_identity_proof", insertable = false, updatable = false)
    private String uploadGovIdentityProof;


}
