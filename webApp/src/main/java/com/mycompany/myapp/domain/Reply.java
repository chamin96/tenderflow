package com.mycompany.myapp.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A Reply.
 */
@Entity
@Table(name = "reply")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Reply implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private Instant date;

    @NotNull
    @Column(name = "response_info", nullable = false)
    private String responseInfo;

    @ManyToOne
    @JsonIgnoreProperties("replies")
    private Tender tender;

    @ManyToOne
    @JsonIgnoreProperties("replies")
    private Supplier supplier;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return date;
    }

    public Reply date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getResponseInfo() {
        return responseInfo;
    }

    public Reply responseInfo(String responseInfo) {
        this.responseInfo = responseInfo;
        return this;
    }

    public void setResponseInfo(String responseInfo) {
        this.responseInfo = responseInfo;
    }

    public Tender getTender() {
        return tender;
    }

    public Reply tender(Tender tender) {
        this.tender = tender;
        return this;
    }

    public void setTender(Tender tender) {
        this.tender = tender;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public Reply supplier(Supplier supplier) {
        this.supplier = supplier;
        return this;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reply)) {
            return false;
        }
        return id != null && id.equals(((Reply) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Reply{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", responseInfo='" + getResponseInfo() + "'" +
            "}";
    }
}
