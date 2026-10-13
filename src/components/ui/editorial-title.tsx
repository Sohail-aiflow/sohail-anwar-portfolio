import { Fragment } from "react";

export function EditorialTitle({
  headline,
  emphasis,
}: {
  headline: string;
  emphasis: string;
}) {
  return (
    <>
      {headline.split("\n").map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}{" "}
      <em>{emphasis}</em>
    </>
  );
}
