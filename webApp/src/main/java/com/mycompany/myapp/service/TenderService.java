package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Tender;
import com.mycompany.myapp.repository.TenderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Tender}.
 */
@Service
@Transactional
public class TenderService {

    private final Logger log = LoggerFactory.getLogger(TenderService.class);

    private final TenderRepository tenderRepository;

    public TenderService(TenderRepository tenderRepository) {
        this.tenderRepository = tenderRepository;
    }

    /**
     * Save a tender.
     *
     * @param tender the entity to save.
     * @return the persisted entity.
     */
    public Tender save(Tender tender) {
        log.debug("Request to save Tender : {}", tender);
        return tenderRepository.save(tender);
    }

    /**
     * Get all the tenders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Tender> findAll(Pageable pageable) {
        log.debug("Request to get all Tenders");
        return tenderRepository.findAll(pageable);
    }


    /**
     * Get one tender by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Tender> findOne(Long id) {
        log.debug("Request to get Tender : {}", id);
        return tenderRepository.findById(id);
    }

    /**
     * Delete the tender by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Tender : {}", id);
        tenderRepository.deleteById(id);
    }
}
