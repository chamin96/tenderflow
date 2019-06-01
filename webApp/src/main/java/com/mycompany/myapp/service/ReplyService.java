package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Reply;
import com.mycompany.myapp.repository.ReplyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Reply}.
 */
@Service
@Transactional
public class ReplyService {

    private final Logger log = LoggerFactory.getLogger(ReplyService.class);

    private final ReplyRepository replyRepository;

    public ReplyService(ReplyRepository replyRepository) {
        this.replyRepository = replyRepository;
    }

    /**
     * Save a reply.
     *
     * @param reply the entity to save.
     * @return the persisted entity.
     */
    public Reply save(Reply reply) {
        log.debug("Request to save Reply : {}", reply);
        return replyRepository.save(reply);
    }

    /**
     * Get all the replies.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Reply> findAll(Pageable pageable) {
        log.debug("Request to get all Replies");
        return replyRepository.findAll(pageable);
    }


    /**
     * Get one reply by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Reply> findOne(Long id) {
        log.debug("Request to get Reply : {}", id);
        return replyRepository.findById(id);
    }

    /**
     * Delete the reply by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Reply : {}", id);
        replyRepository.deleteById(id);
    }
}
