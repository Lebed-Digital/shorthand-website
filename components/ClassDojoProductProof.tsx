import Image from 'next/image';

export default function ClassDojoProductProof() {
  return (
    <figure className="classdojo-product-proof">
      <div className="classdojo-product-proof__image">
        <Image
          src="/screenshot1.png"
          alt="ShortHand Quick Note screen showing a private student note, behavior tags, and a date before saving"
          width={1290}
          height={2796}
          sizes="(max-width: 600px) 72vw, 230px"
        />
      </div>
      <figcaption className="classdojo-product-proof__caption">
        <span className="classdojo-product-proof__label">Here is what this actually looks like.</span>
        <span>
          Select the student, add the detail, choose any useful behavior tags, and save the note with
          the date. The record stays private to the teacher.
        </span>
      </figcaption>
    </figure>
  );
}
