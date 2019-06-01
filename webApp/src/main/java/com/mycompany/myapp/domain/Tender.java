package com.mycompany.myapp.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Tender.
 */
@Entity
@Table(name = "tender")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Tender implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "info")
    private byte[] info;

    @Column(name = "info_content_type")
    private String infoContentType;

    @ManyToOne
    @JsonIgnoreProperties("tenders")
    private Admin admin;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Tender title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public Tender description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getInfo() {
        return info;
    }

    public Tender info(byte[] info) {
        this.info = info;
        return this;
    }

    public void setInfo(byte[] info) {
        this.info = info;
    }

    public String getInfoContentType() {
        return infoContentType;
    }

    public Tender infoContentType(String infoContentType) {
        this.infoContentType = infoContentType;
        return this;
    }

    public void setInfoContentType(String infoContentType) {
        this.infoContentType = infoContentType;
    }

    public Admin getAdmin() {
        return admin;
    }

    public Tender admin(Admin admin) {
        this.admin = admin;
        return this;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tender)) {
            return false;
        }
        return id != null && id.equals(((Tender) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Tender{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", info='" + getInfo() + "'" +
            ", infoContentType='" + getInfoContentType() + "'" +
            "}";
    }
}
