'use client'

import { Link } from "@heroui/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal'

import { title, subtitle } from "@/components/primitives";
import PostCard from "@/components/post-card";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@heroui/input";
import React from "react";

const topics = [
  {
    id: uuidv4(),
    name: 'JavaScript'
  },
  {
    id: uuidv4(),
    name: 'TypeScript'
  },
  {
    id: uuidv4(),
    name: 'Rust'
  },
  {
    id: uuidv4(),
    name: 'Golang'
  },
  {
    id: uuidv4(),
    name: 'Lua'
  },
]

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <section className="py-8 md:py-10">

      <div className="grid grid-cols-5">
        <div className="col-span-4">
          <h2 className={title({ size: "sm" })}>Top posts</h2>
          <PostCard />
        </div>
        <div className="col-span-1 ml-auto">
          <Button onPress={onOpen} color="primary">
            <span>Create new topik</span>
            <Plus />
          </Button>

          <ul>
            {topics.map((topic) => (
              <li key={topic.id} className={subtitle()}>
                <Link href={topic.id}># {topic.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal backdrop='blur' isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create topic</ModalHeader>
              <ModalBody>
                <Input
                  label="Topic name"
                  placeholder="Topic name..."
                  variant="bordered"
                />
                <Input
                  label="Description"
                  placeholder="Enter your Description"
                  type="text"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
